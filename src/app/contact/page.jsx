"use client";
import "./contact.css";
import { useTransitionRouter } from "next-view-transitions";

const page = () => {
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

  const handleNavigation = (e, route) => {
    e.preventDefault();
    router.push(route, {
      onTransitionReady: slideInOut,
    });
  };

  return (
    <div className="contact">
      <div className="contact-img-wrapper">
        <div className="contact-img">
          <img src="/images/contact/contact.jpeg" alt="" />
        </div>
      </div>
      <div className="contact-copy">
        <div className="contact-copy-bio">
          <p className="caps sm">Wu Wei Studios</p>
          <p className="caps sm">Toronto / Copenhagen</p>
        </div>

        <div className="contact-copy-tags">
          <p className="caps sm">Web Systems</p>
          <p className="caps sm">Interface Design</p>
          <p className="caps sm">Creative Development</p>
          <p className="caps sm">End To End Delivery</p>
        </div>

        <div className="contact-copy-addresses">
          <div className="contact-address">
            <p className="caps sm">Toronto</p>
            <p className="caps sm">Studio 302, Richmond St W</p>
            <p className="caps sm">M5V 3A8</p>
          </div>

          <div className="contact-address">
            <p className="caps sm">Copenhagen</p>
            <p className="caps sm">Unit 02 Refshalevej 167A</p>
            <p className="caps sm">1432 KØBENHAVN K</p>
          </div>
        </div>

        <div className="contact-copy-links">
          <a href="/studio" onClick={(e) => handleNavigation(e, "/studio")}>
            <p className="caps sm">Studio Overview</p>
          </a>
          <a href="/archive" onClick={(e) => handleNavigation(e, "/archive")}>
            <p className="caps sm">Project Archive</p>
          </a>
          <a href="/work" onClick={(e) => handleNavigation(e, "/work")}>
            <p className="caps sm">Selected Work</p>
          </a>
        </div>
      </div>

      <div className="contact-footer">
        <div className="fc-col-lg">
          <p className="sm">Developed by Codegrid</p>
        </div>
        <div className="fc-col-sm">
          <p className="sm">&copy; 2025 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default page;
