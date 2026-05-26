// src/components/Footer.jsx

import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <>

      {/* TOP SUPPORT BAR */}
      <div className="support-bar">

        <div className="support-center">

          <span className="support-text">
            24X7 Support
          </span>

          <div className="social-icons">

            <div className="social-icon facebook">
              f
            </div>

            <div className="social-icon instagram">
              ◎
            </div>

            <div className="social-icon telegram">
              ✈
            </div>

            <div className="social-icon twitter">
              ✕
            </div>

          </div>

        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">

        {/* LEFT */}
        <div className="footer-left">

          <div className="safe-logo">
            🔒
          </div>

          <div className="safe-content">

            <div className="safe-title">
              100% SAFE
            </div>

            <div className="safe-desc">
              Protected connection and encrypted data.
            </div>

          </div>

        </div>

        {/* CENTER */}
        <div className="footer-center">
          © Copyright 2025. All Rights Reserved. Powered by Shiv247.
        </div>

        {/* RIGHT */}
        <div className="footer-right">

          <div className="footer-badge">
            18+
          </div>

          <div className="footer-badge">
            gc
          </div>

          <div className="footer-badge">
            gst
          </div>

        </div>

      </div>

    </>
  );
};

export default Footer;