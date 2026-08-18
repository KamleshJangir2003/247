import React, { useState } from "react";
import "../styles/Auth.css";
import logo from "../assets/images/logo2.png";
import { FaUser, FaKey, FaSignInAlt, FaFacebookF, FaInstagram, FaTelegramPlane, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return setError("Please enter username and password.");
    setLoading(true);
    setError("");
    const result = await login(username, password);
    setLoading(false);
    if (result.ok) navigate(result.redirect);
    else setError(result.error);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    const result = await demoLogin();
    setLoading(false);
    if (result.ok) navigate(result.redirect);
    else setError(result.error || "Demo login failed.");
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="auth-page">
      <img src={logo} alt="logo" className="logo" />
      <div className="auth-box">
        <h2>LOGIN 📌</h2>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={handleKey}
          />
          <span><FaUser /></span>
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={handleKey}
          />
          <span><FaKey /></span>
        </div>
        {error && <p className="login-error">{error}</p>}
        <div className="forgot"><a href="/">Forgot Password?</a></div>
        <button className="btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Please wait…" : <> Login <FaSignInAlt /> </>}
        </button>
        <button className="btn btn-demo" onClick={handleDemoLogin} disabled={loading}>
          Login with demo ID <FaSignInAlt />
        </button>
        <p className="register-text">Don't have an account? <Link to="/register"> Register here</Link></p>
        <p className="captcha">
          This site is protected by reCAPTCHA and the Google<br />
          <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms"> Terms of Service</Link> apply.
        </p>
        <div className="bottom-links">
          <a href="/">info@777games.com</a>
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
