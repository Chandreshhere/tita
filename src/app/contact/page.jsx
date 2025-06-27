"use client";
import "./contact.css";

const page = () => {
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
          <p className="caps sm">Studio Overview</p>
          <p className="caps sm">Project Archive</p>
          <p className="caps sm">Selected Work</p>
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
