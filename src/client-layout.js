"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

import Menu from "@/components/Menu/Menu";
import Feather from "@/components/Feather/Feather";

import { ReactLenis } from "lenis/react";

export default function ClientLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrollSettings = isMobile
    ? {
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.05,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      }
    : {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.15,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      };

  return (
    <>
      {isHome && <Feather />}
      <ReactLenis root options={scrollSettings}>
        <>
          <Menu />
        </>
        {children}
      </ReactLenis>
    </>
  );
}
