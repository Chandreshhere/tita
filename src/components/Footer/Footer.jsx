"use client";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-socials">
        <div className="fs-col-lg"></div>
        <div className="fs-col-sm">
          <div className="fs-header">
            <p className="sm">( Socials )</p>
          </div>
          <div className="footer-social">
            <h2>Email</h2>
          </div>
          <div className="footer-social">
            <h2>LinkedIn</h2>
          </div>
          <div className="footer-social">
            <h2>Behance</h2>
          </div>
          <div className="footer-social">
            <h2>Instagram</h2>
          </div>
          <div className="footer-social">
            <h2>Vimeo</h2>
          </div>
        </div>
      </div>

      <div className="footer-copy">
        <div className="fc-col-lg">
          <p className="sm">Developed by</p>
          <p className="sm">Codegrid</p>
        </div>
        <div className="fc-col-sm">
          <p className="sm">&copy; 2025 All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
