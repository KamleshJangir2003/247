import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock, FaSignInAlt } from "react-icons/fa";
import "./AdminLogin.css";

const ADMIN_USER = "admin777";
const ADMIN_PASS = "Admin@2024";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) return setError("Please enter username and password.");
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="al-page">
      <div className="al-card">

        <div className="al-logo">
          <div className="al-logo-icon">🛡️</div>
          <h1>777GAMES</h1>
          <p>Admin Control Panel</p>
        </div>

        <div className="al-divider" />

        <label className="al-label">Username</label>
        <div className="al-input-wrap">
          <FaUserShield className="al-input-icon" />
          <input
            type="text"
            placeholder="Admin username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={handleKey}
          />
        </div>

        <label className="al-label">Password</label>
        <div className="al-input-wrap">
          <FaLock className="al-input-icon" />
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={handleKey}
          />
        </div>

        {error && <div className="al-error">{error}</div>}

        <button className="al-btn" onClick={handleLogin}>
          Sign In &nbsp;<FaSignInAlt />
        </button>

        <div className="al-footer">© 2024 777Games — Restricted Access</div>
      </div>
    </div>
  );
};

export default AdminLogin;
