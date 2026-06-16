import React, { useState } from "react";
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

import { Link, useNavigate } from "react-router-dom";

const DEMO_USER = "demo";
const DEMO_PASS = "demo123";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === DEMO_USER && password === DEMO_PASS) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  const handleDemoLogin = () => {
    navigate("/dashboard");
  };

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
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
          />
          <span><FaUser /></span>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
          <span><FaKey /></span>
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="forgot">
          <a href="/">Forgot Password?</a>
        </div>

        <button className="btn" onClick={handleLogin}>
          Login <FaSignInAlt />
        </button>

        <button className="btn btn-demo" onClick={handleDemoLogin}>
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