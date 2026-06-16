import React, { useState } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import "./Profile.css";

const Profile = () => {
  const [form, setForm] = useState({ name:"John Doe", email:"user@777games.com", mobile:"98765XXXXX", dob:"01/01/1990", city:"Mumbai", state:"Maharashtra" });
  const [msg, setMsg] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    setMsg({ type:"success", text:"Profile updated successfully!" });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="profile-content">
          <div className="profile-header"><span className="p-dot"></span> My Profile</div>

          {msg && <div className={`p-msg ${msg.type}`}>{msg.text}</div>}

          <div className="profile-card">
            <div className="profile-avatar">👤</div>
            <div className="profile-username">km****1851</div>
            <div className="profile-balance">Balance: <strong>₹5,000</strong></div>
          </div>

          <div className="profile-form">
            {[
              { label:"Full Name",    name:"name",   type:"text" },
              { label:"Email",        name:"email",  type:"email" },
              { label:"Mobile",       name:"mobile", type:"text" },
              { label:"Date of Birth",name:"dob",    type:"text" },
              { label:"City",         name:"city",   type:"text" },
              { label:"State",        name:"state",  type:"text" },
            ].map(f => (
              <div className="p-form-group" key={f.name}>
                <label>{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handle} />
              </div>
            ))}
            <button className="p-save-btn" onClick={save}>SAVE CHANGES</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
