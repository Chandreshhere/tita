"use client";
import "./home.css";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FeaturedWork from "@/components/FeaturedWork/FeaturedWork";
import ProcessCards from "@/components/ProcessCards/ProcessCards";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-img">
          <img src="/images/home/hero-img.jpg" alt="" />
        </div>

        <div className="hero-temp-nav">
          <p className="caps light" id="logo">
            Wu Wei
          </p>
          <p className="caps sm light">Menu</p>
        </div>

        <div className="hero-keywords">
          <p className="caps sm light">Purpose</p>
          <p className="caps sm light">Balance</p>
          <p className="caps sm light">Structure</p>
          <p className="caps sm light">Expression</p>
        </div>

        <div className="hero-footer">
          <h3 className="light">
            We craft digital experiences with intention, balancing clarity,
            creativity, and code to build websites that feel as effortless as
            they are powerful.
          </h3>

          <p className="caps sm light">( Scroll down )</p>
        </div>
      </section>

      <FeaturedWork />

      <ProcessCards />
    </>
  );
}
