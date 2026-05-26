import React from "react";
import "../styles/Auth.css";
import logo from "../assets/images/logo2.png";

import {
  FaUser,
  FaKey,
  FaSignInAlt,
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTimes,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="auth-page">

      <img
        src={logo}
        alt="logo"
        className="logo"
      />

      <div className="auth-box">

        <h2>LOGIN 📌</h2>

        <div className="input-box">
          <input type="text" placeholder="Username" />
          <span><FaUser /></span>
        </div>

        <div className="input-box">
          <input type="password" placeholder="Password" />
          <span><FaKey /></span>
        </div>

        <div className="forgot">
          <a href="/">Forgot Password?</a>
        </div>

        <button className="btn">
          Login <FaSignInAlt />
        </button>

        <button className="btn">
          Login with demo ID <FaSignInAlt />
        </button>

        <p className="register-text">
          Don’t have an account?
          <Link to="/register"> Register here</Link>
        </p>

        <p className="captcha">
          This site is protected by reCAPTCHA and the Google
          <br />
          <Link to="/privacy">Privacy Policy</Link> and
          <Link to="/terms"> Terms of Service</Link> apply.
        </p>

        <div className="bottom-links">
          <a href="/">info@shiv247.com</a>
          <a href="/">⬇ Download APK</a>
        </div>

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

export default Login;