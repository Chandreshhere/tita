"use client";
import "./home.css";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import DynamicBackground from "@/components/DynamicBackground/DynamicBackground";

export default function Home() {
  return (
    <>
      <section className="hero">
        <DynamicBackground />

        <div className="hero-content"></div>
      </section>
    </>
  );
}
