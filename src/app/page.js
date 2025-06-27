"use client";
import "./home.css";
import { useState } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import DynamicBackground from "@/components/DynamicBackground/DynamicBackground";
import AnimeLink from "@/components/AnimeLink/AnimeLink";

export default function Home() {
  return (
    <>
      <section className="hero">
        <DynamicBackground logoPath="/images/logos/logo_light.png" />

        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-header-col-lg"></div>
            <div className="hero-header-col-sm">
              <h3>
                Systems thinking and creative execution brought into web
                development for consistent outcomes.
              </h3>
            </div>
          </div>

          <div className="hero-footer">
            <div className="hero-footer-col-lg">
              <p className="sm caps mono">Studios</p>
              <p className="sm caps mono">Toronto and Copenhagen</p>
            </div>
            <div className="hero-footer-col-sm">
              <div className="hero-tags">
                <p className="sm caps mono">Web Systems</p>
                <p className="sm caps mono">Interface Design</p>
                <p className="sm caps mono">Creative Development</p>
                <p className="sm caps mono">End to End Delivery</p>
              </div>

              <div className="hero-link">
                <AnimeLink route="/contact" label="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
