"use client";
import { useEffect, useRef } from "react";

const DynamicBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const startTimeRef = useRef(null);
  const mouseTrailRef = useRef([]);
  const lastMouseMoveRef = useRef(0);
  const decayFactorRef = useRef(0);

  const backgroundColor = "#1e1e1e";
  const patternLight = "#e4e7df";
  const patternDark = "#e4e7df";
  const animationSpeed = 1.0;
  const fluidStrength = 2.0;
  const trailLength = 20;

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = 1.5;
    canvas.width = window.innerWidth * dpr * scale;
    canvas.height = window.innerHeight * dpr * scale;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec3 uBackgroundColor;
      uniform vec3 uPatternLight;
      uniform vec3 uPatternDark;
      uniform float uAnimationSpeed;
      uniform vec2 uMouseTrail[50];
      uniform int uTrailLength;
      uniform float uFluidStrength;
      uniform float uDecayFactor;

      vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                       dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                   mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                       dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
      }

      vec2 getFluidDisplacement(vec2 pos) {
        vec2 displacement = vec2(0.0);
        
        for (int i = 0; i < 50; i++) {
          if (i >= uTrailLength) break;
          
          vec2 trailPos = (uMouseTrail[i] * 2.0 - iResolution.xy) / iResolution.y;
          float dist = length(pos - trailPos);
          float trailDecay = pow(1.0 - float(i) / float(uTrailLength), 2.0);
          float spatialDecay = exp(-dist * 2.0);
          float influence = spatialDecay * trailDecay * pow(uDecayFactor, 0.5);
          
          if (influence > 0.005) {
            vec2 direction = normalize(pos - trailPos + vec2(0.001));
            float angle = atan(direction.y, direction.x);
            
            float noiseVal = noise(pos * 8.0 + iTime * 0.5);
            angle += noiseVal * 0.5;
            
            vec2 flowDir = vec2(cos(angle + 1.57), sin(angle + 1.57));
            displacement += flowDir * influence * uFluidStrength * 0.05;
          }
        }
        
        return displacement * smoothstep(0.0, 0.3, uDecayFactor);
      }

      #define R iResolution 
      void mainImage(out vec4 O, in vec2 I) {
        vec2 fluidDisp = getFluidDisplacement(2.*I/R.y - R.xy/R.y);
        vec2 p = 2.*I/R.y - R.xy/R.y + fluidDisp;
        
        float a = max(abs(p.x) + p.y, -p.y) - .5, t = iTime * 0.15 * uAnimationSpeed, y = atan(p.x, p.y);
        vec4 s = .25 * cos(vec4(25.*log(t)*sin(.25*t)/t, 1., 2., 0.) + t - y), e = s.yzxy,
             f = clamp(min(vec4(a) - s, e - vec4(a)) * 1e2, 0., 1.),
             g = (e - .1) * dot(f, 20.*(s - e));
        
        float intensity = .2*g.x + .7*g.y + .07*g.z + g.w;
        
        vec3 finalColor;
        if (intensity > 0.1) {
          finalColor = mix(uBackgroundColor, uPatternLight, clamp(intensity, 0., 1.));
        } else if (intensity < -0.1) {
          finalColor = mix(uBackgroundColor, uPatternDark, clamp(-intensity, 0., 1.));
        } else {
          finalColor = uBackgroundColor;
        }
        
        O = vec4(finalColor, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "iResolution"
    );
    const timeUniformLocation = gl.getUniformLocation(program, "iTime");
    const backgroundColorUniformLocation = gl.getUniformLocation(
      program,
      "uBackgroundColor"
    );
    const patternLightUniformLocation = gl.getUniformLocation(
      program,
      "uPatternLight"
    );
    const patternDarkUniformLocation = gl.getUniformLocation(
      program,
      "uPatternDark"
    );
    const animationSpeedUniformLocation = gl.getUniformLocation(
      program,
      "uAnimationSpeed"
    );
    const mouseTrailUniformLocation = gl.getUniformLocation(
      program,
      "uMouseTrail"
    );
    const trailLengthUniformLocation = gl.getUniformLocation(
      program,
      "uTrailLength"
    );
    const fluidStrengthUniformLocation = gl.getUniformLocation(
      program,
      "uFluidStrength"
    );
    const decayFactorUniformLocation = gl.getUniformLocation(
      program,
      "uDecayFactor"
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = 1.5;

      const x = (event.clientX - rect.left) * dpr * scale;
      const y = (rect.height - (event.clientY - rect.top)) * dpr * scale;

      lastMouseMoveRef.current = Date.now();

      mouseTrailRef.current.unshift({ x, y });

      if (mouseTrailRef.current.length > trailLength) {
        mouseTrailRef.current = mouseTrailRef.current.slice(0, trailLength);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = 1.5;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      const canvasWidth = displayWidth * dpr * scale;
      const canvasHeight = displayHeight * dpr * scale;

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = displayWidth + "px";
        canvas.style.height = displayHeight + "px";
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    function render() {
      if (!gl || !program) return;

      resizeCanvas();

      const currentTime = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000 + 1.0
        : 1.0;

      const timeSinceLastMove = (Date.now() - lastMouseMoveRef.current) / 1000;
      const targetDecayFactor =
        timeSinceLastMove < 0.02
          ? 1.0
          : Math.max(0, 1.0 - Math.pow((timeSinceLastMove - 0.02) * 1.2, 1.5));

      const lerpSpeed = timeSinceLastMove < 0.1 ? 0.15 : 0.03;
      decayFactorRef.current +=
        (targetDecayFactor - decayFactorRef.current) * lerpSpeed;
      const decayFactor = decayFactorRef.current;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      const bgColor = hexToRgb(backgroundColor);
      const lightColor = hexToRgb(patternLight);
      const darkColor = hexToRgb(patternDark);

      const trailArray = new Float32Array(100);
      for (let i = 0; i < Math.min(mouseTrailRef.current.length, 50); i++) {
        trailArray[i * 2] = mouseTrailRef.current[i].x;
        trailArray[i * 2 + 1] = mouseTrailRef.current[i].y;
      }

      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform3f(
        backgroundColorUniformLocation,
        bgColor.r,
        bgColor.g,
        bgColor.b
      );
      gl.uniform3f(
        patternLightUniformLocation,
        lightColor.r,
        lightColor.g,
        lightColor.b
      );
      gl.uniform3f(
        patternDarkUniformLocation,
        darkColor.r,
        darkColor.g,
        darkColor.b
      );
      gl.uniform1f(animationSpeedUniformLocation, animationSpeed);
      gl.uniform2fv(mouseTrailUniformLocation, trailArray);
      gl.uniform1i(
        trailLengthUniformLocation,
        Math.min(mouseTrailRef.current.length, trailLength)
      );
      gl.uniform1f(fluidStrengthUniformLocation, fluidStrength);
      gl.uniform1f(decayFactorUniformLocation, decayFactor);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameRef.current = requestAnimationFrame(render);
    }

    startTimeRef.current = Date.now();
    render();

    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (gl && programRef.current) {
        gl.deleteProgram(programRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        imageRendering: "pixelated",
        imageRendering: "-moz-crisp-edges",
        imageRendering: "crisp-edges",
      }}
    />
  );
};

export default DynamicBackground;
