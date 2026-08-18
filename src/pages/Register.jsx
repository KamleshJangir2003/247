import React, { useState } from "react";
import "../styles/Auth.css";
import logo from "../assets/images/logo2.png";
import { FaEye, FaEyeSlash, FaSignInAlt, FaFacebookF, FaInstagram, FaTelegramPlane, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: "", lastName: "", username: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const handle = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async () => {
    if (!form.firstName || !form.username || !form.email || !form.password)
      return setError("First name, username, email and password are required.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");

    setLoading(true);
    const res = await authApi.register({
      firstName: form.firstName,
      lastName:  form.lastName,
      username:  form.username,
      email:     form.email,
      phone:     form.phone,
      password:  form.password,
    });
    if (!res?.success) {
      setLoading(false);
      return setError(res?.message || "Registration failed.");
    }

    // Auto-login after successful registration
    const loginResult = await login(form.username, form.password);
    setLoading(false);
    if (loginResult.ok) navigate(loginResult.redirect);
    else navigate("/login");
  };

  return (
    <div className="auth-page">
      <img src={logo} alt="logo" className="logo" />
      <div className="auth-box register-box">
        <h2>Sign Up 📌</h2>

        <div className="row">
          <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handle} />
          <input type="text" name="lastName"  placeholder="Last Name"  value={form.lastName}  onChange={handle} />
        </div>

        <input type="text"  name="username" placeholder="Username" className="full-input" value={form.username} onChange={handle} />
        <input type="email" name="email"    placeholder="Email"    className="full-input" value={form.email}    onChange={handle} />
        <input type="text"  name="phone"    placeholder="Mobile No." className="full-input" value={form.phone}  onChange={handle} />

        <div className="input-box">
          <input type={showPass ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handle} />
          <span onClick={() => setShowPass(!showPass)} style={{ cursor: "pointer" }}>
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-box">
          <input type={showConfirm ? "text" : "password"} name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={handle} />
          <span onClick={() => setShowConfirm(!showConfirm)} style={{ cursor: "pointer" }}>
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait…" : <> Sign Up <FaSignInAlt /> </>}
        </button>

        <Link to="/login">
          <button className="btn">Login <FaSignInAlt /></button>
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
