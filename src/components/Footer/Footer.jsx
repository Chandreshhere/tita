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
            <a href="mailto:contact@codegrid.com">
              <h2>Email</h2>
            </a>
          </div>
          <div className="footer-social">
            <a href="https://www.youtube.com/@codegrid">
              <h2>LinkedIn</h2>
            </a>
          </div>
          <div className="footer-social">
            <a href="https://www.youtube.com/@codegrid">
              <h2>Behance</h2>
            </a>
          </div>
          <div className="footer-social">
            <a href="https://www.youtube.com/@codegrid">
              <h2>Instagram</h2>
            </a>
          </div>
          <div className="footer-social">
            <a href="https://vimeo.com/codegrid">
              <h2>Vimeo</h2>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copy">
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

export default Footer;
