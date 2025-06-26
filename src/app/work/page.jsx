"use client";
import "./work.css";
import { portfolio } from "./portfolio";
import { useTransitionRouter } from "next-view-transitions";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const page = () => {
  const workRef = useRef(null);
  const router = useTransitionRouter();

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0) scale(1)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-30%) scale(0.90)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  const navigateToProject = () => {
    router.push("/sample-project", {
      onTransitionReady: slideInOut,
    });
  };

  useGSAP(
    () => {
      const workContainers =
        workRef.current.querySelectorAll(".work-container");
      const yearIndices = document.querySelectorAll(".year-index");

      workContainers.forEach((container, index) => {
        ScrollTrigger.create({
          trigger: container,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => {
            yearIndices.forEach((yearIndex, i) => {
              yearIndex.classList.remove("active");
              const highlighter = yearIndex.querySelector(
                ".year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            if (yearIndices[index]) {
              yearIndices[index].classList.add("active");
              const highlighter = yearIndices[index].querySelector(
                ".year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
          onEnterBack: () => {
            yearIndices.forEach((yearIndex, i) => {
              yearIndex.classList.remove("active");
              const highlighter = yearIndex.querySelector(
                ".year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            if (yearIndices[index]) {
              yearIndices[index].classList.add("active");
              const highlighter = yearIndices[index].querySelector(
                ".year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        });
      });

      yearIndices.forEach((yearIndex) => {
        const highlighter = yearIndex.querySelector(".year-index-highlighter");
        gsap.set(highlighter, { scaleX: 0 });
      });

      const workYears = workRef.current.querySelectorAll(".work-year");
      workYears.forEach((workYear) => {
        ScrollTrigger.create({
          trigger: workYear,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            gsap.to(workYear, {
              y: self.progress * -100,
              duration: 0.3,
              ease: "none",
            });
          },
        });
      });
    },
    { scope: workRef }
  );

  return (
    <div className="work" ref={workRef}>
      <div className="year-indices">
        {portfolio.map((yearData, yearIndex) => (
          <div
            key={yearIndex}
            className={`year-index year-index-var-${(yearIndex % 3) + 1}`}
          >
            <p className="sm">{yearData.year.slice(-2)}</p>
            <div className="year-index-highlighter"></div>
          </div>
        ))}
      </div>
      <div className="work-sidebar"></div>
      <div className="work-main">
        {portfolio.map((yearData, yearIndex) => (
          <div key={yearIndex} className="work-container">
            <div className="work-year-container">
              <h1 className="work-year">'{yearData.year.slice(-2)}</h1>
            </div>
            <div className="work-projects-container">
              {yearData.projects.map((project, projectIndex) => (
                <div
                  key={projectIndex}
                  className="work-project"
                  onClick={navigateToProject}
                  style={{ cursor: "pointer" }}
                >
                  <div className="work-project-img">
                    <img src={project.img} alt={project.name} />
                  </div>
                  <div className="work-project-info">
                    <p className="sm work-project-info-name">{project.name}</p>
                    <p className="sm work-project-info-tags">{project.tags}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
