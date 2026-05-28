// src/components/Footer.jsx

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      {/* TOP AREA */}
      <div className="footer-top">

        {/* SUPPORT */}
        <div className="support-section">
          <h2>24X7 Support</h2>
          <p>WhatsApp -</p>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          <Link to="/about">About Us</Link>

          <span>•</span>

          <Link to="/terms">Terms and Conditions</Link>

          <span>•</span>

          <Link to="/responsible-gaming">Responsible Gaming</Link>

        </div>

        {/* SOCIAL ICONS */}
        <div className="social-icons">

          <div className="icon whatsapp">
            <FaWhatsapp />
          </div>

          <div className="icon facebook">
            <FaFacebookF />
          </div>

          <div className="icon instagram">
            <FaInstagram />
          </div>

          <div className="icon telegram">
            <FaTelegramPlane />
          </div>

          <div className="icon youtube">
            <FaYoutube />
          </div>

        </div>

      </div>

      {/* MIDDLE */}
      <div className="footer-middle">

        {/* LEFT */}
        <div className="safe-box">

          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            alt="safe"
          />

          <div>

            <h3>100% SAFE</h3>

            <p>
              Protected connection and encrypted data.
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="footer-badges">

          <div className="badge red">
            18+
          </div>

          <div className="badge">
            gc
          </div>

          <div className="badge">
            gt
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          Contact for any query - WhatsApp -
        </p>

        <h4>
          © Copyright 2020. All Rights Reserved.
        </h4>

      </div>

    </footer>
  );
};

export default Footer;