"use client";
import { useState, useEffect, useRef } from "react";

import DynamicBackground from "@/components/DynamicBackground/DynamicBackground";
import Copy from "@/components/Copy/Copy";
import BtnLink from "@/components/BtnLink/BtnLink";
import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import ProcessCards from "@/components/ProcessCards/ProcessCards";
import Clients from "@/components/Clients/Clients";
import Footer from "@/components/Footer/Footer";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

let isInitialLoad = true;

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(false); // temporarily disabled
  const studioRef = useRef(null);

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useGSAP(() => {
    const heroLink = document.querySelector(".hero-link");
    const animationDelay = showPreloader ? 6.2 : 0.9;

    if (showPreloader) {
      const tl = gsap.timeline({
        delay: 0.3,
        defaults: {
          ease: "hop",
        },
      });

      const counts = document.querySelectorAll(".count");
      const progressBar = document.querySelector(".progress-bar");
      const preloaderOverlay = document.querySelector(".preloader-overlay");

      const progressTl = gsap.timeline({
        delay: 0.3,
      });

      counts.forEach((count, index) => {
        const digits = count.querySelectorAll(".digit h1");

        tl.to(
          digits,
          {
            y: "0%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1
        );

        if (index < counts.length) {
          tl.to(
            digits,
            {
              y: "-120%",
              duration: 1,
              stagger: 0.075,
            },
            index * 1 + 1
          );
        }

        progressTl.to(
          progressBar,
          {
            scaleY: (index + 1) / counts.length,
            duration: 1,
            ease: "hop",
          },
          index * 1
        );
      });

      progressTl
        .set(progressBar, {
          transformOrigin: "top",
        })
        .to(progressBar, {
          scaleY: 0,
          duration: 0.75,
          ease: "hop",
        })
        .to(preloaderOverlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            preloaderOverlay.style.display = "none";
          },
        });
    }

    if (heroLink) {
      gsap.set(heroLink, { y: 30, opacity: 0 });

      gsap.to(heroLink, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: animationDelay,
        ease: "power4.out",
      });
    }
  }, [showPreloader]);

  useGSAP(() => {
    if (!studioRef.current) return;

    const studioHeroH1 = studioRef.current.querySelector(".studio-hero h1");
    const studioHeroImgWrapper = studioRef.current.querySelector(
      ".studio-hero-img-wrapper"
    );
    const missionLinkWrapper =
      studioRef.current.querySelector(".mission-link");

    if (studioHeroH1) {
      const split = SplitText.create(studioHeroH1, {
        type: "chars",
        charsClass: "char++",
      });

      split.chars.forEach((char) => {
        const wrapper = document.createElement("span");
        wrapper.className = "char-mask";
        wrapper.style.overflow = "hidden";
        wrapper.style.display = "inline-block";
        char.parentNode.insertBefore(wrapper, char);
        wrapper.appendChild(char);
      });

      gsap.set(split.chars, { y: "100%" });

      ScrollTrigger.create({
        trigger: studioHeroH1,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(split.chars, {
            y: "0%",
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
          });
        },
      });
    }

    if (studioHeroImgWrapper) {
      gsap.set(studioHeroImgWrapper, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      ScrollTrigger.create({
        trigger: studioHeroImgWrapper,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(studioHeroImgWrapper, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }

    if (missionLinkWrapper) {
      gsap.set(missionLinkWrapper, { y: 30, opacity: 0 });

      ScrollTrigger.create({
        trigger: missionLinkWrapper.closest(".mission-intro-copy"),
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(missionLinkWrapper, {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 1.2,
            ease: "power3.out",
          });
        },
      });
    }

    // Mission images spread left/right with tilt on scroll
    const missionImgs = studioRef.current.querySelectorAll(".mission-img");
    if (missionImgs.length > 0) {
      // Fan out like stacked cards from center pivot
      const rotations = [-28, -20, -12, -4, 4, 12, 20, 28];

      const spreadTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".mission-intro",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      missionImgs.forEach((img, i) => {
        if (i < rotations.length) {
          spreadTl.to(
            img,
            {
              rotation: rotations[i],
              duration: 1,
              ease: "none",
            },
            0
          );
        }
      });
    }
  });

  return (
    <>
      {showPreloader && (
        <div className="preloader-overlay">
          <div className="progress-bar"></div>
          <div className="counter">
            <div className="count">
              <div className="digit">
                <h1>0</h1>
              </div>
              <div className="digit">
                <h1>0</h1>
              </div>
            </div>
            <div className="count">
              <div className="digit">
                <h1>2</h1>
              </div>
              <div className="digit">
                <h1>7</h1>
              </div>
            </div>
            <div className="count">
              <div className="digit">
                <h1>6</h1>
              </div>
              <div className="digit">
                <h1>5</h1>
              </div>
            </div>
            <div className="count">
              <div className="digit">
                <h1>9</h1>
              </div>
              <div className="digit">
                <h1>8</h1>
              </div>
            </div>
            <div className="count">
              <div className="digit">
                <h1>9</h1>
              </div>
              <div className="digit">
                <h1>9</h1>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="hero">
        <DynamicBackground logoPath="/creation-hands.png" />

        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-header-col-lg"></div>
            <div className="hero-header-col-sm">
              <Copy animateOnScroll={false} delay={showPreloader ? 6.2 : 0.9}>
                <h3>
                  Marketing is no longer made. It is composed. Where art meets
                  algorithm.
                </h3>
              </Copy>
            </div>
          </div>

          <div className="hero-footer">
            <div className="hero-footer-col-lg">
              <Copy animateOnScroll={false} delay={showPreloader ? 6.2 : 0.9}>
                <p className="sm caps mono">Indore (22.7196° N, 75.8577° E)</p>
                <p className="sm caps mono">Ahmedabad (23.0225° N, 72.5714° E)</p>
              </Copy>
            </div>
            <div className="hero-footer-col-sm">
              <div className="hero-tags">
                <Copy
                  animateOnScroll={false}
                  delay={showPreloader ? 6.2 : 0.9}
                >
                  <p className="sm caps mono">Art</p>
                  <p className="sm caps mono">Strategy</p>
                  <p className="sm caps mono">Technology</p>
                  <p className="sm caps mono">Performance</p>
                </Copy>
              </div>

              <div className="hero-link">
                <BtnLink route="/contact" label="Let's Create" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="studio" ref={studioRef}>
        <section className="studio-hero">
          <h1 className="caps">This is that agency</h1>
        </section>

        <section className="studio-hero-img">
          <div className="studio-hero-img-wrapper">
            <img src="/images/studio/hero.jpeg" alt="" />
          </div>
        </section>

        <section className="studio-header">
          <div className="studio-header-copy">
            <Copy>
              <h2>
                TITA is a digital marketing agency born in Indore and now in
                Ahmedabad. Two cities. Two energies. One vision. We operate at
                the intersection of art, strategy, technology, and performance.
              </h2>
            </Copy>
          </div>
        </section>

        <WhoWeAre />

        <section className="mission-intro">
          <div className="mission-intro-col-sm">
            <div className="mission-images">
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
              <div className="mission-img"><img src="/statue.png" alt="" loading="lazy" /></div>
            </div>
          </div>
          <div className="mission-intro-col-lg">
            <div className="mission-intro-copy">
              <Copy>
                <h3>
                  Once, art changed the world. Now, data does. We stand where
                  both meet. We are not vendors. We are patrons of modern
                  ambition.
                </h3>
                <br />
                <h3>
                  We don't run ads. We orchestrate movements. We don't design
                  posts. We paint legacies. This is the renaissance of brands.
                </h3>
              </Copy>

              <div className="mission-link">
                <BtnLink route="/work" label="View Portfolio" dark />
              </div>
            </div>
          </div>
        </section>

        <ProcessCards />

        <Clients />
      </div>

      <Footer />
    </>
  );
}
