"use client";
import "./Feather.css";
import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_GAP = 1;
const BRIGHTNESS_THRESHOLD = 30;
const FEATHER_DISPLAY_WIDTH = { desktop: 650, mobile: 350 };

const Feather = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const swingRef = useRef(null);
  const canvasRef = useRef(null);
  const morphImgDataRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const modeRef = useRef("idle");
  const renderFnRef = useRef(null);
  const wobbleRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const morphRef = useRef(0);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const modalOverlayRef = useRef(null);

  const kickRender = useCallback(() => {
    if (animFrameRef.current || !renderFnRef.current) return;
    renderFnRef.current();
  }, []);

  const startDissolve = useCallback(() => {
    if (modeRef.current === "dissolving") return;
    modeRef.current = "dissolving";

    for (const p of particlesRef.current) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 4;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - Math.random() * 2.5;
    }

    if (containerRef.current) containerRef.current.classList.add("dissolved");
    kickRender();
  }, [kickRender]);

  const startReform = useCallback(() => {
    if (modeRef.current !== "dissolving") return;
    modeRef.current = "reforming";

    if (containerRef.current) containerRef.current.classList.remove("dissolved");
    kickRender();
  }, [kickRender]);

  // Load feather.png + logo.png → create particles with morph targets
  useEffect(() => {
    if (window.innerWidth < 1000) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const isMobile = window.innerWidth < 1000;
    const targetW = isMobile
      ? FEATHER_DISPLAY_WIDTH.mobile
      : FEATHER_DISPLAY_WIDTH.desktop;
    const dpr = window.devicePixelRatio || 1;

    const featherImg = new Image();
    featherImg.crossOrigin = "anonymous";
    featherImg.src = "/feather.png";

    const morphImg = new Image();
    morphImg.crossOrigin = "anonymous";
    morphImg.src = "/logo_white.png";

    let morphLoaded = false;

    Promise.all([
      new Promise((r) => { featherImg.onload = () => r(featherImg); }),
      new Promise((r) => {
        morphImg.onload = () => { morphLoaded = true; r(morphImg); };
        morphImg.onerror = () => r(null);
      }),
    ]).then(([fImg, mImg]) => {
      const aspect = fImg.height / fImg.width;
      const displayW = targetW;
      const displayH = Math.round(targetW * aspect);

      canvas.width = Math.round(displayW * dpr);
      canvas.height = Math.round(displayH * dpr);
      canvas.style.width = displayW + "px";
      canvas.style.height = displayH + "px";

      // Sample feather pixels
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d");
      offCtx.drawImage(fImg, 0, 0, offscreen.width, offscreen.height);
      const fPixels = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;

      const gap = Math.max(1, Math.round(PARTICLE_GAP * dpr));
      const particles = [];

      for (let y = 0; y < offscreen.height; y += gap) {
        for (let x = 0; x < offscreen.width; x += gap) {
          const idx = (y * offscreen.width + x) * 4;
          const r = fPixels[idx];
          const g = fPixels[idx + 1];
          const b = fPixels[idx + 2];
          const a = fPixels[idx + 3];

          if (Math.max(r, g, b) > BRIGHTNESS_THRESHOLD && a > 20) {
            particles.push({
              ox: x / dpr,
              oy: y / dpr,
              x: x / dpr,
              y: y / dpr,
              vx: 0,
              vy: 0,
              r, g, b,
              a: a / 255,
              oa: a / 255,
              size: (1.8 + Math.random() * 1.0) * (isMobile ? 0.8 : 1),
              phase: Math.random() * Math.PI * 2,
              wx: 0,
              wy: 0,
              tx: undefined,
              ty: undefined,
              tr: 0,
              tg: 0,
              tb: 0,
              ta: 0,
              hasTarget: false,
            });
          }
        }
      }

      // Sample morph target image (logo) — centered in canvas space
      if (mImg && morphLoaded) {
        const mScale = Math.min(displayW / mImg.width, displayH / mImg.height) * 0.75;
        const mW = Math.round(mImg.width * mScale);
        const mH = Math.round(mImg.height * mScale);
        const mOffX = (displayW - mW) / 2;
        const mOffY = (displayH - mH) / 2;

        morphImgDataRef.current = { img: mImg, x: mOffX, y: mOffY, w: mW, h: mH };

        const mCanvas = document.createElement("canvas");
        mCanvas.width = Math.round(mW * dpr);
        mCanvas.height = Math.round(mH * dpr);
        const mCtx = mCanvas.getContext("2d");
        mCtx.drawImage(mImg, 0, 0, mCanvas.width, mCanvas.height);
        const mPixels = mCtx.getImageData(0, 0, mCanvas.width, mCanvas.height).data;

        const morphPositions = [];
        for (let y = 0; y < mCanvas.height; y += gap) {
          for (let x = 0; x < mCanvas.width; x += gap) {
            const idx = (y * mCanvas.width + x) * 4;
            const r = mPixels[idx];
            const g = mPixels[idx + 1];
            const b = mPixels[idx + 2];
            const a = mPixels[idx + 3];
            if (a > 30) {
              morphPositions.push({
                x: x / dpr + mOffX,
                y: y / dpr + mOffY,
                r, g, b,
                a: a / 255,
              });
            }
          }
        }

        if (morphPositions.length > 0) {
          for (let i = morphPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [morphPositions[i], morphPositions[j]] = [morphPositions[j], morphPositions[i]];
          }

          const pIndices = [...Array(particles.length).keys()];
          for (let i = pIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pIndices[i], pIndices[j]] = [pIndices[j], pIndices[i]];
          }

          const assignCount = Math.min(particles.length, morphPositions.length);
          for (let i = 0; i < assignCount; i++) {
            const p = particles[pIndices[i]];
            const mp = morphPositions[i];
            p.tx = mp.x;
            p.ty = mp.y;
            p.tr = mp.r;
            p.tg = mp.g;
            p.tb = mp.b;
            p.ta = mp.a;
            p.hasTarget = true;
          }
        }
      }

      particlesRef.current = particles;
      modeRef.current = "normal";

      // --- Render loop ---
      const wobble = wobbleRef;
      const morph = morphRef;

      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const mode = modeRef.current;
        const mt = morph.current;
        let needsContinue = false;

        // When mt > 0.92, fade particles out as clean logo fades in
        const particleFade = mt > 0.92 ? Math.max(0, 1 - (mt - 0.92) / 0.08) : 1;

        for (let i = 0, len = particles.length; i < len; i++) {
          const p = particles[i];

          if (mode === "dissolving") {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.045;
            p.vx *= 0.992;
            p.a -= 0.005;
            if (p.a > 0) needsContinue = true;
          } else if (mode === "reforming") {
            const targetX = mt > 0 && p.hasTarget
              ? p.ox * (1 - mt) + p.tx * mt
              : p.ox;
            const targetY = mt > 0 && p.hasTarget
              ? p.oy * (1 - mt) + p.ty * mt
              : p.oy;
            const targetA = mt > 0 && !p.hasTarget
              ? p.oa * Math.max(0, 1 - mt * 4)
              : p.oa;
            p.x += (targetX - p.x) * 0.07;
            p.y += (targetY - p.y) * 0.07;
            p.a += (targetA - p.a) * 0.07;
            p.vx = 0;
            p.vy = 0;
            if (
              Math.abs(p.x - targetX) > 0.3 ||
              Math.abs(p.y - targetY) > 0.3 ||
              Math.abs(p.a - targetA) > 0.01
            ) {
              needsContinue = true;
            } else {
              p.x = targetX;
              p.y = targetY;
              p.a = targetA;
            }
          } else if (mode === "normal") {
            const drag = 0.15 + p.phase * 0.05;
            const targetWx = -wobble.current.x * drag;
            const targetWy = -wobble.current.y * drag;
            p.wx += (targetWx - p.wx) * 0.08;
            p.wy += (targetWy - p.wy) * 0.08;

            const wobbleDamp = 1 - mt;

            if (mt > 0 && p.hasTarget) {
              const baseX = p.ox * (1 - mt) + p.tx * mt;
              const baseY = p.oy * (1 - mt) + p.ty * mt;
              p.x = baseX + p.wx * wobbleDamp;
              p.y = baseY + p.wy * wobbleDamp;
              p.a = p.oa;
            } else if (mt > 0 && !p.hasTarget) {
              p.x = p.ox + p.wx * wobbleDamp;
              p.y = p.oy + p.wy * wobbleDamp;
              p.a = p.oa * Math.max(0, 1 - mt * 4);
            } else {
              p.x = p.ox + p.wx;
              p.y = p.oy + p.wy;
            }

            if (Math.abs(p.wx) > 0.1 || Math.abs(p.wy) > 0.1) {
              needsContinue = true;
            }
          }

          if (p.a <= 0) continue;

          // Skip drawing particles when fully replaced by clean logo
          if (particleFade <= 0) continue;

          if ((mode === "normal" || mode === "reforming") && mt > 0 && p.hasTarget) {
            const cr = Math.round(p.r * (1 - mt) + p.tr * mt);
            const cg = Math.round(p.g * (1 - mt) + p.tg * mt);
            const cb = Math.round(p.b * (1 - mt) + p.tb * mt);
            ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          } else {
            ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
          }

          ctx.globalAlpha = p.a * particleFade;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        // Draw clean logo image, crossfading with particles
        if ((mode === "normal" || mode === "reforming") && mt > 0.92 && morphImgDataRef.current) {
          const md = morphImgDataRef.current;
          const imgAlpha = (mt - 0.92) / 0.08;
          ctx.globalAlpha = imgAlpha;
          ctx.drawImage(md.img, md.x, md.y, md.w, md.h);
        }

        ctx.restore();

        if (mode === "normal") {
          wobble.current.x *= 0.9;
          wobble.current.y *= 0.9;
        }

        if (mode === "reforming" && !needsContinue) {
          modeRef.current = "normal";
          animFrameRef.current = null;
          return;
        }

        if (mode === "dissolving" && !needsContinue) {
          animFrameRef.current = null;
          return;
        }

        if (needsContinue) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          animFrameRef.current = null;
        }
      }

      renderFnRef.current = render;
      render();
    });

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  // Scroll-driven path + swing + morph + dissolve
  useGSAP(() => {
    if (window.innerWidth < 1000) return;
    if (!containerRef.current || !wrapperRef.current || !swingRef.current) return;

    const container = containerRef.current;
    const swing = swingRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 1000;
    const featherW = isMobile ? FEATHER_DISPLAY_WIDTH.mobile : FEATHER_DISPLAY_WIDTH.desktop;
    const hw = featherW / 2;

    const waypoints = isMobile
      ? [
          { x: vw * 0.40 - hw, y: vh * 0.15, rotateY: -4, rotateX: 2 },
          { x: vw * 0.28 - hw, y: vh * 0.10, rotateY: 5, rotateX: -2 },
          { x: vw * 0.18 - hw, y: vh * 0.12, rotateY: 7, rotateX: -3 },
          { x: vw * 0.25 - hw, y: vh * 0.15, rotateY: 4, rotateX: 2 },
          { x: vw * 0.45 - hw, y: vh * 0.17, rotateY: -5, rotateX: -2 },
          { x: vw * 0.52 - hw, y: vh * 0.19, rotateY: -6, rotateX: 3 },
          { x: vw * 0.42 - hw, y: vh * 0.21, rotateY: -3, rotateX: -2 },
          { x: vw * 0.28 - hw, y: vh * 0.23, rotateY: 5, rotateX: 2 },
          { x: vw * 0.22 - hw, y: vh * 0.25, rotateY: 6, rotateX: -2 },
          { x: vw * 0.32 - hw, y: vh * 0.27, rotateY: 3, rotateX: 2 },
          { x: vw * 0.42 - hw, y: vh * 0.29, rotateY: -3, rotateX: -1 },
          { x: vw * 0.38 - hw, y: vh * 0.32, rotateY: -1, rotateX: 1 },
          { x: vw * 0.40 - hw, y: vh * 0.35, rotateY: 0, rotateX: 0 },
        ]
      : [
          // Start at hero bottom
          { x: vw * 0.64 - hw, y: vh * 0.70, rotateY: -5, rotateX: 3, rotation: 0, dur: 0.5 },
          // Float left on first scroll
          { x: vw * 0.12 - hw, y: vh * 0.55, rotateY: 8, rotateX: 2, rotation: -45, dur: 1 },
          // Float right
          { x: vw * 0.82 - hw, y: vh * 0.45, rotateY: -6, rotateX: -2, rotation: -90, dur: 1 },
          // Float right edge — WhoWeAre section
          { x: vw - hw * 1.5, y: vh * 0.50, rotateY: -5, rotateX: 1, rotation: -120, dur: 1 },
          // Hold right — through WhoWeAre + mission-intro, drifting down
          { x: vw - hw * 1.5, y: vh * 0.65, rotateY: -4, rotateX: -1, rotation: -150, dur: 2.5 },
          // Float left through ProcessCards
          { x: vw * 0.15 - hw, y: vh * 0.60, rotateY: 6, rotateX: 2, rotation: -200, dur: 1 },
          // Float right through ProcessCards
          { x: vw * 0.80 - hw, y: vh * 0.45, rotateY: -5, rotateX: -1, rotation: -250, dur: 1 },
          // Float to center — approaching Footer (morph happens here)
          { x: vw * 0.50 - hw, y: vh * 0.35, rotateY: 0, rotateX: 0, rotation: -300, dur: 1 },
          // Hold center in Footer — morph into logo
          { x: vw * 0.50 - hw, y: vh * 0.45, rotateY: 0, rotateX: 0, rotation: -330, dur: 1.5 },
          // Drift down before dissolve
          { x: vw * 0.50 - hw, y: vh * 0.55, rotateY: 0, rotateX: 0, rotation: -360, dur: 0.5 },
        ];

    // Set initial position
    gsap.set(container, {
      x: waypoints[0].x,
      y: waypoints[0].y,
      rotateY: waypoints[0].rotateY,
      rotateX: waypoints[0].rotateX,
      rotation: 0,
      scale: 0,
      opacity: 0,
    });
    lastPosRef.current.x = waypoints[0].x;
    lastPosRef.current.y = waypoints[0].y;
    gsap.set(swing, { rotation: 3 });

    // Fade in
    gsap.to(container, {
      scale: 1,
      opacity: 1,
      duration: 2.2,
      delay: 2.2,
      ease: "power2.out",
    });

    // Continuous floating — dampened during morph
    const swingTweens = [];
    const rand = (min, max) => min + Math.random() * (max - min);
    const sign = () => (Math.random() > 0.5 ? 1 : -1);

    function doSwing() {
      if (!swingRef.current) return;
      const mt = morphRef.current || 0;
      const damp = Math.max(0, 1 - mt);
      const tl = gsap.timeline({ onComplete: doSwing });
      tl.to(swing, {
        rotation: sign() * rand(3, 8) * damp,
        y: sign() * rand(5, 12) * damp,
        x: sign() * rand(3, 7) * damp,
        duration: rand(3, 5),
        ease: "sine.inOut",
      });
      swingTweens.push(tl);
    }
    doSwing();

    // Scroll-driven path
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        refreshPriority: -1,
        onUpdate: (self) => {
          const cx = gsap.getProperty(container, "x");
          const cy = gsap.getProperty(container, "y");
          wobbleRef.current.x = cx - lastPosRef.current.x;
          wobbleRef.current.y = cy - lastPosRef.current.y;
          lastPosRef.current.x = cx;
          lastPosRef.current.y = cy;
          kickRender();
        },
      },
    });

    waypoints.forEach((wp, i) => {
      if (i === 0) return;
      scrollTl.to(container, {
        x: wp.x,
        y: wp.y,
        rotateY: wp.rotateY,
        rotateX: wp.rotateX,
        rotation: wp.rotation || 0,
        duration: wp.dur || 1,
        ease: "none",
      });
    });

    // Morph: feather → logo particles as Footer enters viewport
    ScrollTrigger.create({
      trigger: ".footer",
      start: "top 80%",
      end: "top 30%",
      scrub: 1.5,
      onUpdate: (self) => {
        morphRef.current = self.progress;
        kickRender();
      },
    });

    // Dissolve/explode near bottom of Footer
    ScrollTrigger.create({
      trigger: ".footer",
      start: "bottom 70%",
      end: "bottom 50%",
      onEnter: () => startDissolve(),
      onLeaveBack: () => startReform(),
    });

    return () => { swingTweens.forEach((t) => t.kill()); };
  }, [startDissolve, startReform, kickRender]);

  // Modal open
  const openModal = useCallback(() => {
    if (modeRef.current === "dissolving") return;
    setModalOpen(true);
  }, []);

  // Modal close
  const closeModal = useCallback(() => {
    if (!modalOverlayRef.current || !modalRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setModalOpen(false) });
    tl.to(modalRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power3.in",
    });
    tl.to(
      modalOverlayRef.current,
      { opacity: 0, duration: 0.3, ease: "power2.in" },
      "-=0.15"
    );
  }, []);

  // Animate modal in
  useEffect(() => {
    if (modalOpen && modalOverlayRef.current && modalRef.current) {
      gsap.set(modalOverlayRef.current, { opacity: 0, visibility: "visible" });
      gsap.set(modalRef.current, { y: 40, opacity: 0, scale: 0.95 });
      const tl = gsap.timeline();
      tl.to(modalOverlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      tl.to(
        modalRef.current,
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );
    }
  }, [modalOpen]);

  // Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && modalOpen) closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, closeModal]);

  // Canvas hit-test — pointer only over actual feather pixels
  const handleCanvasMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cx = (e.clientX - rect.left) * dpr;
    const cy = (e.clientY - rect.top) * dpr;
    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(Math.round(cx), Math.round(cy), 1, 1).data;
    canvas.style.cursor = pixel[3] > 20 ? "pointer" : "default";
  }, []);

  return (
    <>
      <div className="feather-wrapper" ref={wrapperRef}>
        <div
          className="feather-container"
          ref={containerRef}
          role="button"
          tabIndex={0}
          aria-label="Open contact form"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openModal();
          }}
        >
          <div className="feather-swing" ref={swingRef}>
            <canvas
              className="feather-canvas"
              ref={canvasRef}
              onMouseMove={handleCanvasMove}
              onClick={openModal}
            />
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="feather-modal-overlay active" ref={modalOverlayRef}>
          <div className="feather-modal-backdrop" onClick={closeModal} />
          <div className="feather-modal" ref={modalRef}>
            <div className="feather-modal-header">
              <h2 className="caps">Contact Us</h2>
              <button
                className="feather-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="feather-modal-body">
              <p className="sm">
                Where art meets algorithm. Let us orchestrate your brand&apos;s
                renaissance.
              </p>

              <div className="feather-modal-links">
                <a
                  href="mailto:hello@tita.agency"
                  className="feather-modal-link"
                >
                  <span className="label">Email</span>
                  <p className="sm">hello@tita.agency</p>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feather-modal-link"
                >
                  <span className="label">LinkedIn</span>
                  <p className="sm">TITA Agency</p>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feather-modal-link"
                >
                  <span className="label">Instagram</span>
                  <p className="sm">@tita.agency</p>
                </a>
              </div>
            </div>

            <div className="feather-modal-footer">
              <p className="sm caps mono">
                Indore &middot; Ahmedabad &mdash; EST. MMXXI
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feather;
