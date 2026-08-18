import React, { useState } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import { changePassword } from "../../api/auth";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [msg, setMsg]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.current) return setMsg({ type: "error", text: "Enter current password." });
    if (form.newPass.length < 6) return setMsg({ type: "error", text: "New password must be at least 6 characters." });
    if (form.newPass !== form.confirm) return setMsg({ type: "error", text: "Passwords do not match." });

    setLoading(true);
    const res = await changePassword({ currentPassword: form.current, newPassword: form.newPass });
    setLoading(false);

    if (res?.success) {
      setMsg({ type: "success", text: "Password changed successfully!" });
      setForm({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setMsg(null), 3000);
    } else {
      setMsg({ type: "error", text: res?.message || "Failed to change password." });
    }
  };

  return (
    <div className="cp-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="cp-content">
          <div className="cp-header"><span className="cp-dot"></span> Change Password</div>
          {msg && <div className={`cp-msg ${msg.type}`}>{msg.text}</div>}
          <div className="cp-form">
            {[
              { label: "Current Password", name: "current", placeholder: "Enter current password" },
              { label: "New Password",     name: "newPass", placeholder: "Min 6 characters" },
              { label: "Confirm Password", name: "confirm", placeholder: "Re-enter new password" },
            ].map(f => (
              <div className="cp-group" key={f.name}>
                <label>{f.label}</label>
                <input type="password" name={f.name} value={form[f.name]} placeholder={f.placeholder} onChange={handle} />
              </div>
            ))}
            <button className="cp-btn" onClick={submit} disabled={loading}>
              {loading ? "Please wait…" : "CHANGE PASSWORD"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassword;
