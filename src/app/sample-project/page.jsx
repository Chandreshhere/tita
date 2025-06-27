"use client";
import "./sample-project.css";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

import BtnLink from "@/components/BtnLink/BtnLink";

const page = () => {
  const sampleProjectRef = useRef(null);

  useGSAP(
    () => {
      const imagesContainer = sampleProjectRef.current.querySelector(
        ".sp-images-container"
      );
      const progressContainer = sampleProjectRef.current.querySelector(
        ".sp-images-scroll-progress-container"
      );
      const counter = sampleProjectRef.current.querySelector(
        "#sp-images-scroll-counter"
      );

      ScrollTrigger.create({
        trigger: imagesContainer,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 100);
          counter.textContent = progress;

          const containerHeight = progressContainer.offsetHeight;

          const isMobile = window.innerWidth < 1000;
          const baseDistance = window.innerHeight + containerHeight;
          const mobileMultiplier = isMobile ? 1.25 : 1;
          const moveDistance = baseDistance * mobileMultiplier;

          gsap.to(progressContainer, {
            y: -self.progress * moveDistance,
            duration: 0.1,
            ease: "none",
          });
        },
      });

      gsap.set(progressContainer, {
        position: "fixed",
        top: "100vh",
        left: "1.5rem",
        right: "1.5rem",
        width: "calc(100% - 3rem)",
      });
    },
    { scope: sampleProjectRef }
  );

  return (
    <div className="sample-project" ref={sampleProjectRef}>
      <section className="sp-hero">
        <h1>Timefold 22</h1>
      </section>

      <section className="sp-banner-img">
        <img src="/images/work/work_006.jpeg" alt="" />
      </section>

      <section className="sp-copy">
        <div className="sp-info">
          <div className="sp-col sp-col-lg">
            <div className="sp-tags">
              <p className="sm caps mono">Creative Direction</p>
              <p className="sm caps mono">Motion Design</p>
              <p className="sm caps mono">Visual Identity</p>
            </div>
          </div>
          <div className="sp-col sp-col-sm">
            <div className="sp-year">
              <p className="sm caps mono">2025</p>
            </div>

            <div className="client">
              <p className="sm caps mono">Self-Initiated</p>
            </div>
          </div>
        </div>

        <div className="sp-copy-wrapper">
          <div className="sp-col-lg">
            <div className="sp-copy-title">
              <h3>Exploring Motion Through Structured Design</h3>
            </div>
          </div>
          <div className="sp-col-sm">
            <div className="sp-copy-description">
              <p>
                Timefold 22 is an exploration of motion through layered temporal
                loops. Built with a modular design system, the visuals pulse and
                stretch to reflect the elasticity of time in digital
                environments. The concept embraces minimal forms with high
                contrast dynamics to suggest an ongoing shift — folding the
                present into an abstract continuum.
              </p>

              <p>
                Designed as a speculative identity for a non-linear brand
                system, this piece operates both as a visual experiment and a
                creative prompt. Every frame is composed to highlight rhythm,
                silence, and distortion — aimed at evoking a subtle tension
                between chaos and control.
              </p>

              <div className="sp-link">
                <BtnLink route="/" label="Live Demo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sp-images">
        <div className="sp-images-scroll-progress-container">
          <h1 id="sp-images-scroll-counter">0</h1>
          <h1>/100</h1>
        </div>
        <div className="sp-images-container">
          <div className="sp-img">
            <img src="/images/work/work_001.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_021.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_003.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_009.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_015.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_023.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_024.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_001.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_021.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_003.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_009.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_015.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_023.jpeg" alt="" />
          </div>
          <div className="sp-img">
            <img src="/images/work/work_024.jpeg" alt="" />
          </div>
        </div>
      </section>

      <section className="sp-next-project">
        <div className="sp-next-project-copy">
          <p className="sm">(More Projects)</p>
          <div className="sp-next-project-names">
            <h1>Hidden Signal</h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
