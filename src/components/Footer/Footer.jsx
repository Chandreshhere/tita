"use client";
import "./Footer.css";
import { useRef } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useGSAP(
    () => {
      const textElements = footerRef.current.querySelectorAll(".footer-text");

      textElements.forEach((element) => {
        const textContent = element.querySelector(".footer-text-content");
        gsap.set(textContent, {
          y: "100%",
        });
      });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 80%",
        onEnter: () => {
          textElements.forEach((element, index) => {
            const textContent = element.querySelector(".footer-text-content");
            gsap.to(textContent, {
              y: "0%",
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out",
            });
          });
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <div className="footer" ref={footerRef}>
      <div className="footer-closing">
        <div className="footer-text">
          <div className="footer-text-content">
            <h2>Rebirth is not optional. It is inevitable.</h2>
          </div>
        </div>
      </div>

      <div className="footer-socials">
        <div className="fs-col-lg">
          <div className="footer-text">
            <div className="footer-text-content">
              <p className="sm caps mono">Indore | Ahmedabad</p>
            </div>
          </div>
          <div className="footer-text">
            <div className="footer-text-content">
              <p className="sm caps mono">
                Founded by Ghazal Somaiya & Naamdasi Patel
              </p>
            </div>
          </div>
          <div className="footer-text">
            <div className="footer-text-content">
              <p className="sm caps mono">EST. MMXXI</p>
            </div>
          </div>
        </div>
        <div className="fs-col-sm">
          <div className="fs-header">
            <div className="footer-text">
              <div className="footer-text-content">
                <p className="sm caps">( Connect )</p>
              </div>
            </div>
          </div>
          <div className="footer-social">
            <a href="mailto:hello@tita.agency">
              <div className="footer-text">
                <div className="footer-text-content">
                  <h2>Email</h2>
                </div>
              </div>
            </a>
          </div>
          <div className="footer-social">
            <a href="#">
              <div className="footer-text">
                <div className="footer-text-content">
                  <h2>LinkedIn</h2>
                </div>
              </div>
            </a>
          </div>
          <div className="footer-social">
            <a href="#">
              <div className="footer-text">
                <div className="footer-text-content">
                  <h2>Behance</h2>
                </div>
              </div>
            </a>
          </div>
          <div className="footer-social">
            <a href="#">
              <div className="footer-text">
                <div className="footer-text-content">
                  <h2>Instagram</h2>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copy">
        <div className="fc-col-lg">
          <div className="footer-text">
            <div className="footer-text-content">
              <p className="sm caps">This Is That Agency</p>
            </div>
          </div>
        </div>
        <div className="fc-col-sm">
          <div className="footer-text">
            <div className="footer-text-content">
              <p className="sm caps">&copy; TITA {new Date().getFullYear()}. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
