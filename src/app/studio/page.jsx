"use client";
import "./studio.css";
import { useRef } from "react";

import Copy from "@/components/Copy/Copy";
import BtnLink from "@/components/BtnLink/BtnLink";
import Footer from "@/components/Footer/Footer";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const services = {
  technology: [
    "Web Personalisation",
    "UI/UX",
    "Shopify Specialisation",
    "E-commerce Ecosystems",
    "Email Marketing",
    "Automations",
    "Chatbots",
  ],
  brand: [
    "Social Media Marketing",
    "Content & Copywriting",
    "Graphic Design & Illustration",
    "Editing & Animation",
    "Film Production & Product Photography",
    "Campaign Planning",
    "Print, OOH, Mainline",
    "New Brand Launch & Rebranding",
  ],
  media: [
    "Media Planning",
    "Performance Marketing",
    "Google Ads",
    "YouTube Marketing",
    "LinkedIn Marketing",
  ],
};

const page = () => {
  const studioRef = useRef(null);

  useGSAP(() => {
    if (!studioRef.current) return;

    // Hero char reveal
    const heroTitle = studioRef.current.querySelector(".svc-hero-title h1");
    if (heroTitle) {
      const split = SplitText.create(heroTitle, {
        type: "chars",
        charsClass: "char++",
      });

      split.chars.forEach((char) => {
        const wrapper = document.createElement("span");
        wrapper.className = "char-mask";
        char.parentNode.insertBefore(wrapper, char);
        wrapper.appendChild(char);
      });

      gsap.set(split.chars, { y: "100%" });
      gsap.to(split.chars, {
        y: "0%",
        duration: 0.8,
        stagger: 0.06,
        delay: 0.85,
        ease: "power3.out",
      });
    }

    // Hero image clip reveal
    const heroImg = studioRef.current.querySelector(".svc-hero-img");
    if (heroImg) {
      gsap.set(heroImg, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.to(heroImg, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.2,
        delay: 0.6,
        ease: "power3.out",
      });
    }

    // Service spread images — parallax
    const spreadImgs = studioRef.current.querySelectorAll(".spread-img-inner");
    spreadImgs.forEach((img) => {
      gsap.to(img, {
        y: -60,
        scrollTrigger: {
          trigger: img.closest(".svc-spread"),
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    // Service spread — large title reveal
    const spreadTitles = studioRef.current.querySelectorAll(".spread-bg-title");
    spreadTitles.forEach((title) => {
      gsap.set(title, { y: 80, opacity: 0 });
      ScrollTrigger.create({
        trigger: title.closest(".svc-spread"),
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(title, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
          });
        },
      });
    });

    // Service items stagger
    const spreadSections = studioRef.current.querySelectorAll(".svc-spread");
    spreadSections.forEach((section) => {
      const items = section.querySelectorAll(".svc-item");
      gsap.set(items, { y: 20, opacity: 0 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
          });
        },
      });
    });

    // Chiaroscuro bars
    const chiaBars = studioRef.current.querySelectorAll(".chia-bar");
    chiaBars.forEach((bar) => {
      gsap.set(bar, { scaleX: 0 });
      ScrollTrigger.create({
        trigger: bar,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(bar, {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.out",
          });
        },
      });
    });
  });

  return (
    <>
      <div className="studio" ref={studioRef}>
        {/* Hero */}
        <section className="svc-hero">
          <div className="svc-hero-title">
            <h1 className="caps">Services</h1>
          </div>
          <div className="svc-hero-img">
            <img src="/images/studio/hero.jpeg" alt="" />
          </div>
          <div className="svc-hero-sub">
            <Copy animateOnScroll={false} delay={1.4}>
              <p className="sm caps mono">The Trinity</p>
              <p className="sm caps mono" style={{ color: "var(--foreground-200)" }}>
                Technology &middot; Brand &middot; Media
              </p>
            </Copy>
          </div>
        </section>

        {/* Technology Spread */}
        <section className="svc-spread spread-tech">
          <div className="spread-bg-title">
            <h1 className="caps">Technology</h1>
          </div>
          <div className="spread-layout">
            <div className="spread-col-img">
              <div className="spread-img">
                <div className="spread-img-inner">
                  <img src="/images/process/process_001.jpeg" alt="" loading="lazy" />
                </div>
              </div>
              <div className="spread-subtitle">
                <Copy>
                  <p className="sm caps mono" style={{ color: "var(--accent-gold)" }}>
                    01 &mdash; The Architecture
                  </p>
                </Copy>
              </div>
            </div>
            <div className="spread-col-list">
              <div className="spread-desc">
                <Copy>
                  <p style={{ color: "var(--foreground-200)" }}>
                    Web experiences that adapt to user behaviour. Digital journeys
                    that feel intuitive, elegant, and conversion-led. Systems that
                    work silently to drive efficiency and revenue.
                  </p>
                </Copy>
              </div>
              <div className="svc-items">
                {services.technology.map((item, i) => (
                  <div className="svc-item" key={i}>
                    <span className="svc-item-dot"></span>
                    <p className="sm caps">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Spread */}
        <section className="svc-spread spread-brand">
          <div className="spread-bg-title">
            <h1 className="caps">Brand</h1>
          </div>
          <div className="spread-layout spread-layout-reverse">
            <div className="spread-col-list">
              <div className="spread-desc">
                <Copy>
                  <p style={{ color: "var(--foreground-200)" }}>
                    Crafting digital narratives that build visibility, community,
                    and cultural relevance. Visual identities that communicate
                    personality with clarity and distinction.
                  </p>
                </Copy>
              </div>
              <div className="svc-items">
                {services.brand.map((item, i) => (
                  <div className="svc-item" key={i}>
                    <span className="svc-item-dot"></span>
                    <p className="sm caps">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="spread-col-img">
              <div className="spread-img">
                <div className="spread-img-inner">
                  <img src="/images/process/process_002.jpeg" alt="" loading="lazy" />
                </div>
              </div>
              <div className="spread-subtitle">
                <Copy>
                  <p className="sm caps mono" style={{ color: "var(--accent-gold)" }}>
                    02 &mdash; The Masterpiece
                  </p>
                </Copy>
              </div>
            </div>
          </div>
        </section>

        {/* Media Spread */}
        <section className="svc-spread spread-media">
          <div className="spread-bg-title">
            <h1 className="caps">Media</h1>
          </div>
          <div className="spread-layout">
            <div className="spread-col-img">
              <div className="spread-img">
                <div className="spread-img-inner">
                  <img src="/images/process/process_003.jpeg" alt="" loading="lazy" />
                </div>
              </div>
              <div className="spread-subtitle">
                <Copy>
                  <p className="sm caps mono" style={{ color: "var(--accent-gold)" }}>
                    03 &mdash; The Amplifier
                  </p>
                </Copy>
              </div>
            </div>
            <div className="spread-col-list">
              <div className="spread-desc">
                <Copy>
                  <p style={{ color: "var(--foreground-200)" }}>
                    Data-driven acquisition strategies designed to convert attention
                    into revenue. Allocating budgets intelligently to maximise reach,
                    efficiency, and return.
                  </p>
                </Copy>
              </div>
              <div className="svc-items">
                {services.media.map((item, i) => (
                  <div className="svc-item" key={i}>
                    <span className="svc-item-dot"></span>
                    <p className="sm caps">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chiaroscuro Philosophy */}
        <section className="chiaroscuro">
          <div className="chiaroscuro-inner">
            <div className="chia-label">
              <Copy>
                <p className="sm caps mono" style={{ color: "var(--accent-gold)" }}>
                  Our Philosophy
                </p>
              </Copy>
            </div>

            <div className="chia-title">
              <Copy>
                <h1 className="caps">Chiaroscuro Marketing</h1>
              </Copy>
            </div>

            <div className="chia-grid">
              <div className="chia-col">
                <div className="chia-bar chia-bar-light"></div>
                <Copy>
                  <h3>Light</h3>
                  <p className="sm caps mono" style={{ color: "var(--foreground-200)" }}>
                    Creativity
                  </p>
                </Copy>
              </div>
              <div className="chia-col">
                <div className="chia-bar chia-bar-shadow"></div>
                <Copy>
                  <h3>Shadow</h3>
                  <p className="sm caps mono" style={{ color: "var(--foreground-200)" }}>
                    Data
                  </p>
                </Copy>
              </div>
              <div className="chia-col chia-col-result">
                <div className="chia-bar chia-bar-gold"></div>
                <Copy>
                  <h3 style={{ color: "var(--accent-gold)" }}>Together</h3>
                  <p className="sm caps mono" style={{ color: "var(--accent-gold)" }}>
                    Conversion
                  </p>
                </Copy>
              </div>
            </div>

            <div className="chia-manifesto">
              <Copy>
                <p>We believe in contrast.</p>
                <p>Emotion backed by numbers.</p>
                <p>Story powered by systems.</p>
              </Copy>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta">
          <div className="svc-cta-inner">
            <Copy>
              <h2>Ready to compose your renaissance?</h2>
            </Copy>
            <BtnLink route="/contact" label="Let's Create" />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default page;
