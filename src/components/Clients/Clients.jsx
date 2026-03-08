"use client";
import "./Clients.css";
import { useRef, useEffect } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  { name: "Light = Creativity", image: "/images/who-we-are/team-1.jpg" },
  { name: "Shadow = Data", image: "/images/who-we-are/team-2.jpg" },
  { name: "Together = Conversion", image: "/images/who-we-are/team-3.jpg" },
];

const Clients = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesDataRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const rafRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const geometryRef = useRef(null);
  const isCanvasVisibleRef = useRef(false);
  const lastDrawnProgressRef = useRef(-1);

  // Setup WebGL particle system for the card image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    // Wait for container to have dimensions
    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(initCanvas);
        return;
      }
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      canvas.width = w;
      canvas.height = h;
      setupGL(w, h);
    };

    function setupGL(w, h) {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: true,
        premultipliedAlpha: false,
      });
      if (!gl) return;

      glRef.current = gl;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const vertSrc = `
        precision highp float;
        uniform vec2 u_resolution;
        attribute vec2 a_position;
        attribute vec4 a_color;
        varying vec4 v_color;
        void main() {
          vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
          v_color = a_color;
          gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
          gl_PointSize = ${(3.5 * dpr).toFixed(1)};
        }
      `;

      const fragSrc = `
        precision highp float;
        uniform float u_alpha;
        varying vec4 v_color;
        void main() {
          if (v_color.a < 0.01) discard;
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          float a = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(v_color.rgb, v_color.a * a * u_alpha);
        }
      `;

      function makeShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }

      const vs = makeShader(gl.VERTEX_SHADER, vertSrc);
      const fs = makeShader(gl.FRAGMENT_SHADER, fragSrc);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      programRef.current = prog;

      const aPos = gl.getAttribLocation(prog, "a_position");
      const aCol = gl.getAttribLocation(prog, "a_color");
      const uAlpha = gl.getUniformLocation(prog, "u_alpha");
      const uRes = gl.getUniformLocation(prog, "u_resolution");

      // Load image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const tc = document.createElement("canvas");
        const ctx = tc.getContext("2d");
        tc.width = w;
        tc.height = h;

        // Cover, shifted left
        const ir = img.width / img.height;
        const cr = w / h;
        let dw, dh, dx, dy;
        if (ir > cr) {
          dh = h;
          dw = h * ir;
          dx = (w - dw) / 2 - w * 0.25;
          dy = 0;
        } else {
          dw = w;
          dh = w / ir;
          dx = -w * 0.25;
          dy = (h - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
        const pixels = ctx.getImageData(0, 0, w, h).data;

        const gap = 2;
        const positions = [];
        const colors = [];
        const particles = [];

        for (let y = 0; y < h; y += gap) {
          for (let x = 0; x < w; x += gap) {
            const idx = (y * w + x) * 4;
            if (pixels[idx + 3] > 10) {
              positions.push(x, y);
              colors.push(
                pixels[idx] / 255,
                pixels[idx + 1] / 255,
                pixels[idx + 2] / 255,
                pixels[idx + 3] / 255
              );
              particles.push({
                ox: x,
                oy: y,
                sx: x + (Math.random() - 0.5) * w * 1.2,
                sy: y + (Math.random() - 0.5) * h * 1.2,
              });
            }
          }
        }

        const posArr = new Float32Array(positions);
        const colArr = new Float32Array(colors);

        const posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, posArr, gl.DYNAMIC_DRAW);

        const colBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
        gl.bufferData(gl.ARRAY_BUFFER, colArr, gl.STATIC_DRAW);

        particlesDataRef.current = {
          particles,
          posArr,
          count: particles.length,
        };
        geometryRef.current = { posBuf, colBuf, aPos, aCol, uRes, uAlpha, w, h };

        // Start render loop
        function render() {
          if (
            !glRef.current ||
            !geometryRef.current ||
            !particlesDataRef.current
          )
            return;

          if (!isCanvasVisibleRef.current) {
            rafRef.current = requestAnimationFrame(render);
            return;
          }

          const progress = scrollProgressRef.current;
          if (Math.abs(progress - lastDrawnProgressRef.current) < 0.0005) {
            rafRef.current = requestAnimationFrame(render);
            return;
          }
          lastDrawnProgressRef.current = progress;

          const { particles, posArr } = particlesDataRef.current;

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            posArr[i * 2] = p.sx + (p.ox - p.sx) * progress;
            posArr[i * 2 + 1] = p.sy + (p.oy - p.sy) * progress;
          }

          const g = geometryRef.current;
          gl.viewport(0, 0, g.w, g.h);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.useProgram(programRef.current);
          gl.uniform2f(g.uRes, g.w, g.h);
          const alpha = 0.15 + progress * 0.85;
          gl.uniform1f(g.uAlpha, alpha);

          gl.bindBuffer(gl.ARRAY_BUFFER, g.posBuf);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArr);
          gl.enableVertexAttribArray(g.aPos);
          gl.vertexAttribPointer(g.aPos, 2, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, g.colBuf);
          gl.enableVertexAttribArray(g.aCol);
          gl.vertexAttribPointer(g.aCol, 4, gl.FLOAT, false, 0, 0);

          gl.drawArrays(gl.POINTS, 0, particlesDataRef.current.count);

          rafRef.current = requestAnimationFrame(render);
        }

        render();
      };
      img.src = "/Untitled design.png";
    }

    const canvasObserver = new IntersectionObserver(
      ([entry]) => {
        isCanvasVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    canvasObserver.observe(canvas);

    initCanvas();

    return () => {
      canvasObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const gl = glRef.current;
      if (gl && !gl.isContextLost()) {
        if (geometryRef.current) {
          gl.deleteBuffer(geometryRef.current.posBuf);
          gl.deleteBuffer(geometryRef.current.colBuf);
        }
        if (programRef.current) gl.deleteProgram(programRef.current);
      }
      glRef.current = null;
      geometryRef.current = null;
      particlesDataRef.current = null;
    };
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section) return;

    const rows = section.querySelectorAll(".patron-row");
    const label = section.querySelector(".patron-label");
    const subs = section.querySelectorAll(".patron-sub");

    const rowData = [];
    let maxRight = 0;
    rows.forEach((row) => {
      const name = row.querySelector(".patron-name");
      const circle = row.querySelector(".patron-circle");
      const chars = Array.from(name.querySelectorAll(".patron-char"));
      const right = name.offsetLeft + name.offsetWidth;
      if (right > maxRight) maxRight = right;
      rowData.push({
        row,
        name,
        circle,
        chars,
        nameLeft: name.offsetLeft,
        nameWidth: name.offsetWidth,
        circleW: circle.offsetWidth,
      });
    });

    const clamp = (v) => Math.max(0, Math.min(1, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    // Pre-animate text when section approaches viewport
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      once: true,
      onEnter: () => {
        rowData.forEach((d, i) => {
          gsap.to(d.chars, {
            x: 0,
            duration: 0.8,
            stagger: 0.02,
            delay: i * 0.25,
            ease: "power3.out",
          });
        });
      },
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pin: true,
      pinSpacing: true,
      scrub: 2.5,
      invalidateOnRefresh: true,
      onRefresh: () => {
        maxRight = 0;
        rowData.forEach((d) => {
          d.nameLeft = d.name.offsetLeft;
          d.nameWidth = d.name.offsetWidth;
          d.circleW = d.circle.offsetWidth;
          const right = d.nameLeft + d.nameWidth;
          if (right > maxRight) maxRight = right;
        });
      },
      onUpdate: (self) => {
        const p = self.progress;

        // Label
        if (label) {
          const inP = Math.min(1, p * 8);
          const outP = p > 0.55 ? clamp((p - 0.55) / 0.05) : 0;
          label.style.opacity = inP * (1 - outP);
        }

        // --- ALL 3 CIRCLES COME TOGETHER & ROLL LEFT IN SYNC ---
        const enterStart = 0.08;
        const enterEnd = 0.20;
        const rollStart = 0.20;
        const rollEnd = 0.60;
        const exitEnd = 0.70;

        rowData.forEach((d) => {
          const { name, circle, nameLeft, nameWidth, circleW } = d;
          const rowRight = nameLeft + nameWidth;

          if (p < enterStart) {
            // Circles hidden
            circle.style.opacity = 0;
            name.style.clipPath = "none";
          } else if (p < enterEnd) {
            // All circles enter from right, converging to the same x (maxRight)
            const ep = (p - enterStart) / (enterEnd - enterStart);
            const ee = easeOut(ep);
            const startX = window.innerWidth + 100;
            const currentX = startX + (maxRight - startX) * ee;
            circle.style.transform = `translate(${currentX}px, -50%) rotate(${(1 - ee) * 540}deg)`;
            circle.style.opacity = ee;
            name.style.clipPath = "none";
          } else if (p < rollEnd) {
            // All circles roll from right to left together
            const rp = (p - rollStart) / (rollEnd - rollStart);
            const re = easeOut(rp);
            const endX = -circleW - 50;
            const currentX = maxRight + (endX - maxRight) * re;
            const circleCenter = currentX + circleW / 2;

            circle.style.transform = `translate(${currentX}px, -50%) rotate(${-re * 720}deg)`;
            circle.style.opacity = 1;

            // Clip each text row as the circle passes over it
            if (circleCenter > rowRight) {
              name.style.clipPath = "none";
            } else if (circleCenter > nameLeft) {
              const hidden = (rowRight - circleCenter) / nameWidth;
              name.style.clipPath = `inset(0 ${Math.min(hidden * 100, 100)}% 0 0)`;
            } else {
              name.style.clipPath = `inset(0 100% 0 0)`;
            }
          } else if (p < exitEnd) {
            // Circles fade out
            const exitP = (p - rollEnd) / (exitEnd - rollEnd);
            circle.style.opacity = 1 - easeOut(exitP);
            name.style.clipPath = `inset(0 100% 0 0)`;
          } else {
            circle.style.opacity = 0;
            name.style.clipPath = `inset(0 100% 0 0)`;
          }
        });

        // --- PARTICLE IMAGE REVEAL starts during the roll ---
        const revealStart = 0.30;
        const revealP = clamp((p - revealStart) / 0.55);
        const revealE = easeOut(revealP);

        scrollProgressRef.current = revealE;

        if (canvas) {
          canvas.style.opacity = revealP > 0 ? 1 : 0;
        }

        // Subtitles fade in staggered after particle image forms
        subs.forEach((sub, i) => {
          const delay = i * 0.04;
          const subP = clamp((p - 0.82 - delay) / 0.12);
          sub.style.opacity = subP;
        });
      },
    });
  }, []);

  return (
    <section className="patrons" ref={sectionRef}>
      <div className="patron-label">
        <p className="sm caps mono">(Our Philosophy)</p>
      </div>

      <div className="patron-names">
        {items.map((item, i) => (
          <div className="patron-row" key={i}>
            <h1 className="patron-name">
              {item.name.split("").map((char, j) => (
                <span className="patron-char" key={j}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
            <div className="patron-circle">
              <img src={item.image} alt={item.name} loading="lazy" />
            </div>
          </div>
        ))}
      </div>

      <div className="patron-subtitle">
        <h2 className="patron-sub patron-sub-left">We believe in contrast.</h2>
        <h2 className="patron-sub patron-sub-right">Emotion backed by numbers.</h2>
        <h2 className="patron-sub patron-sub-center">Story powered by systems.</h2>
      </div>

      <div className="patron-reveal">
        <canvas ref={canvasRef} className="patron-canvas" />
      </div>
    </section>
  );
};

export default Clients;
