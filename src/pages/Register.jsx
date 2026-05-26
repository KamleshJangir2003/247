import React from "react";
import "../styles/Auth.css";
import logo from "../assets/images/logo2.png";

import {
  FaEye,
  FaSignInAlt,
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTimes,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="auth-page">

      <img
        src={logo}
        alt="logo"
        className="logo"
      />

      <div className="auth-box register-box">

        <h2>Sign Up 📌</h2>

        <div className="row">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
        </div>

        <input type="text" placeholder="Username" className="full-input" />

        <div className="email-row">
          <input type="email" placeholder="Email" />
          <button className="otp-btn">Send OTP</button>
        </div>

        <input type="text" placeholder="OTP" className="full-input" />

        <input type="text" placeholder="Mobile No." className="full-input" />

        <div className="input-box">
          <input type="password" placeholder="Password" />
          <span><FaEye /></span>
        </div>

        <div className="input-box">
          <input type="password" placeholder="Confirm Password" />
          <span><FaEye /></span>
        </div>

        <button className="btn">
          Sign Up <FaSignInAlt />
        </button>

        <Link to="/">
          <button className="btn">
            Login <FaSignInAlt />
          </button>
        </Link>

      </div>

      <div className="support">
        <h3>24X7 Support</h3>

        <div className="socials">

          <a href="/"><FaFacebookF /></a>
          <a href="/"><FaInstagram /></a>
          <a href="/"><FaTelegramPlane /></a>
          <a href="/"><FaTimes /></a>

        </div>
      </div>

    </div>
  );
};

export default Register;