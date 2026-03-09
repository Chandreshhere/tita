"use client";
import "./WhoWeAre.css";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhoWeAre = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const rollingCircleRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const scrollEl = scrollRef.current;
    if (!section || !container || !scrollEl) return;

    const containerWidth = scrollEl.offsetWidth;
    const viewportWidth = window.innerWidth;
    const maxTranslateX = containerWidth - viewportWidth;
    const maxTranslateAtTarget = maxTranslateX;

    const isMobile = window.innerWidth < 1000;
    const images = isMobile
      ? [
          { id: "#whoweare-img-1", endTranslateX: -200 },
          { id: "#whoweare-img-2", endTranslateX: -350 },
          { id: "#whoweare-img-3", endTranslateX: -150 },
          { id: "#whoweare-img-4", endTranslateX: -250 },
          { id: "#whoweare-img-5", endTranslateX: -200 },
        ]
      : [
          { id: "#whoweare-img-1", endTranslateX: -400 },
          { id: "#whoweare-img-2", endTranslateX: -650 },
          { id: "#whoweare-img-3", endTranslateX: -300 },
          { id: "#whoweare-img-4", endTranslateX: -500 },
          { id: "#whoweare-img-5", endTranslateX: -450 },
        ];

    const imageEls = images.map((img) => section.querySelector(img.id));

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: `bottom+=${window.innerHeight} top`,
      scrub: 1,
      onUpdate: (self) => {
        const clipPathValue = Math.min(self.progress * 150, 100);
        container.style.clipPath = `circle(${clipPathValue}% at 50% 50%)`;
      },
    });

    // Main pin + horizontal scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * 2.5}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.05) {
          const fadeProgress = progress / 0.05;
          scrollEl.style.opacity = fadeProgress;
          scrollEl.style.transform = `scale(${0.85 + 0.15 * fadeProgress}) translateX(0px)`;
        } else {
          const adjustedProgress = (progress - 0.05) / 0.95;
          const translateX = -Math.min(
            adjustedProgress * maxTranslateAtTarget,
            maxTranslateX
          );
          scrollEl.style.opacity = 1;
          scrollEl.style.transform = `scale(1) translateX(${translateX}px)`;

          imageEls.forEach((el, idx) => {
            if (el) {
              el.style.transform = `translateX(${images[idx].endTranslateX * adjustedProgress}px)`;
            }
          });

          if (rollingCircleRef.current) {
            const rotation = adjustedProgress * 720;
            rollingCircleRef.current.style.transform = `rotate(${rotation}deg)`;
          }
        }
      },
    });
  }, []);

  return (
    <section className="whoweare" ref={sectionRef}>
      <div className="whoweare-container" ref={containerRef}>
        <div className="whoweare-scroll" ref={scrollRef}>
          <div className="whoweare-header">
            <h1>The Renaissance</h1>
          </div>

          <p className="whoweare-text" id="wwa-text-1">Once, art changed the world.</p>
          <p className="whoweare-text" id="wwa-text-2">Now, data does.</p>
          <p className="whoweare-text" id="wwa-text-3">We stand where both meet.</p>
          <p className="whoweare-text" id="wwa-text-4">We are not vendors.</p>
          <p className="whoweare-text" id="wwa-text-5">We are patrons of modern ambition.</p>
          <p className="whoweare-text" id="wwa-text-6">We don&apos;t run ads.</p>
          <div className="whoweare-rolling-circle" id="wwa-text-7" ref={rollingCircleRef}>
            <svg viewBox="0 0 200 200">
              <defs>
                <path
                  id="circlePath"
                  d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                />
              </defs>
              <text>
                <textPath href="#circlePath">
                  We orchestrate movements &bull; We orchestrate movements &bull;
                </textPath>
              </text>
            </svg>
          </div>
          <p className="whoweare-text" id="wwa-text-8">We don&apos;t design posts.</p>

          <div className="whoweare-img" id="whoweare-img-1">
            <img src="/1.jpeg" alt="" loading="lazy" />
          </div>
          <div className="whoweare-img" id="whoweare-img-2">
            <img src="/2.jpeg" alt="" loading="lazy" />
          </div>
          <div className="whoweare-img" id="whoweare-img-3">
            <img src="/3.jpeg" alt="" loading="lazy" />
          </div>
          <div className="whoweare-img" id="whoweare-img-4">
            <img src="/4.jpeg" alt="" loading="lazy" />
          </div>
          <div className="whoweare-img" id="whoweare-img-5">
            <img src="/5.jpeg" alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
