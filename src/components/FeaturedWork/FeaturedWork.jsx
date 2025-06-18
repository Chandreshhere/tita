"use client";
import "./FeaturedWork.css";

import { useRef } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const FeaturedWork = () => {
  const featuredWorkContainerRef = useRef(null);
  const featuredWork = useRef(null);
  const featuredWorkPreviewRef = useRef(null);

  const featuredWorkImages = [
    "/images/home/featured-work-img-1.jpg",
    "/images/home/featured-work-img-2.jpg",
    "/images/home/featured-work-img-3.jpg",
    "/images/home/featured-work-img-4.jpg",
    "/images/home/featured-work-img-5.jpg",
    "/images/home/featured-work-img-6.jpg",
    "/images/home/featured-work-img-7.jpg",
  ];

  const featuredWorkData = [
    {
      info: "Studio Alpha",
      name: "Void Index Drop",
      tag: "Creative Design",
    },
    {
      info: "Future Labs",
      name: "Material Future Run",
      tag: "Event",
    },
    {
      info: "Assembly Co",
      name: "Shape Assembly 003",
      tag: "Creative Concept",
    },
    {
      info: "Motion Grid",
      name: "Unseen Motion Field",
      tag: "Art Direction",
    },
    {
      info: "Canvas Studio",
      name: "Canvas Noise System",
      tag: "Direction",
    },
    {
      info: "Grid Systems",
      name: "Silent Grid Pack",
      tag: "Visual Identity",
    },
    {
      info: "Theory Lab",
      name: "Form Theory Series",
      tag: "Research",
    },
  ];

  useGSAP(
    () => {
      const featuredWorkItems =
        featuredWorkContainerRef.current?.querySelectorAll(
          ".featured-work-item"
        );
      let lastMouseX = window.innerWidth / 2;
      let lastMouseY = window.innerHeight / 2;
      let currentHoveredItem = null;

      featuredWorkItems?.forEach((item) => {
        const featuredWorkCopyElements = item.querySelectorAll(
          ".fw-info, .fw-name, .fw-tag"
        );

        featuredWorkCopyElements.forEach((div) => {
          const featuredWorkCopy = div.querySelector(
            ".featured-work h2, .featured-work p"
          );
          if (featuredWorkCopy) {
            let duplicateFeaturedWorkCopy;
            if (featuredWorkCopy.tagName === "H2") {
              duplicateFeaturedWorkCopy = document.createElement("h2");
              duplicateFeaturedWorkCopy.className = featuredWorkCopy.className;
            } else {
              duplicateFeaturedWorkCopy = document.createElement("p");
              duplicateFeaturedWorkCopy.className = featuredWorkCopy.className;
            }
            duplicateFeaturedWorkCopy.textContent =
              featuredWorkCopy.textContent;
            div.appendChild(duplicateFeaturedWorkCopy);
          }
        });
      });

      const appendFeaturedWorkPreviewImages = (src) => {
        const featuredWorkPreview1 =
          featuredWorkContainerRef.current?.querySelector(
            ".featured-work-preview-img-1"
          );
        const featuredWorkPreview2 =
          featuredWorkContainerRef.current?.querySelector(
            ".featured-work-preview-img-2"
          );

        if (!featuredWorkPreview1 || !featuredWorkPreview2) return;

        const img1 = document.createElement("img");
        const img2 = document.createElement("img");

        img1.src = src;
        img1.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
        img2.src = src;
        img2.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";

        featuredWorkPreview1.appendChild(img1);
        featuredWorkPreview2.appendChild(img2);

        gsap.to([img1, img2], {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "power3.out",
          onComplete: function () {
            removeExtraFWPreviewImages(featuredWorkPreview1);
            removeExtraFWPreviewImages(featuredWorkPreview2);
          },
        });
      };

      const removeExtraFWPreviewImages = (container) => {
        while (container.children.length > 10) {
          container.removeChild(container.firstChild);
        }
      };

      const fwMouseOverAnimation = (elem) => {
        gsap.to(elem.querySelectorAll("h2:nth-child(1), p:nth-child(1)"), {
          top: "-100%",
          duration: 0.3,
        });
        gsap.to(elem.querySelectorAll("h2:nth-child(2), p:nth-child(2)"), {
          top: "0%",
          duration: 0.3,
        });
      };

      const fwMouseOutAnimation = (elem) => {
        gsap.to(elem.querySelectorAll("h2:nth-child(1), p:nth-child(1)"), {
          top: "0%",
          duration: 0.3,
        });
        gsap.to(elem.querySelectorAll("h2:nth-child(2), p:nth-child(2)"), {
          top: "100%",
          duration: 0.3,
        });
      };

      const updatePreviewPosition = () => {
        const preview = featuredWorkPreviewRef.current;
        if (preview) {
          gsap.to(preview, {
            x: lastMouseX + window.scrollX + 20,
            y: lastMouseY + window.scrollY + 20,
            duration: 1,
            ease: "power3.out",
          });
        }
      };

      featuredWorkItems?.forEach((item, index) => {
        const fwHandleMouseEnter = () => {
          if (currentHoveredItem !== item) {
            currentHoveredItem = item;
            fwMouseOverAnimation(item);
            appendFeaturedWorkPreviewImages(featuredWorkImages[index]);
            updatePreviewPosition();
          }
        };

        const fwHandleMouseLeave = () => {
          if (currentHoveredItem === item) {
            currentHoveredItem = null;
            fwMouseOutAnimation(item);
          }
        };

        item.addEventListener("mouseenter", fwHandleMouseEnter);
        item.addEventListener("mouseleave", fwHandleMouseLeave);

        return () => {
          item.removeEventListener("mouseenter", fwHandleMouseEnter);
          item.removeEventListener("mouseleave", fwHandleMouseLeave);
        };
      });

      const handleFWMouseOut = () => {
        gsap.to(".featured-work-preview-img img", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "power3.out",
        });
      };

      featuredWork.current?.addEventListener("mouseleave", handleFWMouseOut);

      const fwHandleMouseMove = (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        const preview = featuredWorkPreviewRef.current;
        if (preview) {
          gsap.to(preview, {
            x: e.pageX + 20,
            y: e.pageY + 20,
            duration: 1,
            ease: "power3.out",
          });
        }
      };

      const handleFWScroll = () => {
        updatePreviewPosition();
      };

      document.addEventListener("mousemove", fwHandleMouseMove);
      window.addEventListener("scroll", handleFWScroll);

      return () => {
        featuredWork.current?.removeEventListener(
          "mouseleave",
          handleFWMouseOut
        );
        document.removeEventListener("mousemove", fwHandleMouseMove);
        window.removeEventListener("scroll", handleFWScroll);
      };
    },
    { scope: featuredWorkContainerRef }
  );

  return (
    <div className="featured-work-container" ref={featuredWorkContainerRef}>
      <div className="featured-work-preview" ref={featuredWorkPreviewRef}>
        <div className="featured-work-preview-img featured-work-preview-img-1"></div>
        <div className="featured-work-preview-img featured-work-preview-img-2"></div>
      </div>

      <div className="featured-work-header">
        <p className="caps sm">
          Latest works &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; Featured works
        </p>
      </div>
      <div className="featured-work" ref={featuredWork}>
        {featuredWorkData.map((project, index) => (
          <div key={index} className="featured-work-item">
            <div className="fw-info">
              <p className="sm">{project.info}</p>
            </div>
            <div className="fw-name">
              <h2 className="caps">{project.name}</h2>
            </div>
            <div className="fw-tag">
              <p className="sm">{project.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedWork;
