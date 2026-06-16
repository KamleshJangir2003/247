import React, { useState } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import "./Support.css";

const Support = () => {
  const [form, setForm] = useState({ subject:"", message:"" });
  const [msg, setMsg] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.subject.trim()) return setMsg({ type:"error", text:"Please enter subject." });
    if (!form.message.trim()) return setMsg({ type:"error", text:"Please enter message." });
    setMsg({ type:"success", text:"Support ticket submitted! We will reply within 24 hours." });
    setForm({ subject:"", message:"" });
    setTimeout(() => setMsg(null), 4000);
  };

  return (
    <div className="support-page">
      <Header />
      <div className="main-layout">
        <AccountSidebar />
        <div className="support-content">
          <div className="support-header"><span className="s-dot"></span> Customer Support</div>

          {/* CONTACT CARDS */}
          <div className="support-cards">
            {[
              { icon:"💬", label:"Live Chat",  value:"Available 24/7",         color:"#00a651" },
              { icon:"📧", label:"Email",      value:"support@777games.com",   color:"#008fc7" },
              { icon:"📱", label:"WhatsApp",   value:"+91 98765 XXXXX",        color:"#25d366" },
              { icon:"📞", label:"Phone",      value:"+91 98765 XXXXX",        color:"#e65c00" },
            ].map((c,i) => (
              <div key={i} className="support-card" style={{ borderTop:`3px solid ${c.color}` }}>
                <div className="s-card-icon">{c.icon}</div>
                <div className="s-card-label">{c.label}</div>
                <div className="s-card-value">{c.value}</div>
              </div>
            ))}
          </div>

          {/* TICKET FORM */}
          <div className="support-form">
            <div className="support-form-title">Submit a Ticket</div>
            {msg && <div className={`s-msg ${msg.type}`}>{msg.text}</div>}
            <div className="s-group">
              <label>Subject*</label>
              <input type="text" name="subject" value={form.subject} placeholder="e.g. Deposit not credited" onChange={handle} />
            </div>
            <div className="s-group">
              <label>Message*</label>
              <textarea name="message" value={form.message} rows={5} placeholder="Describe your issue in detail..." onChange={handle} />
            </div>
            <button className="s-submit-btn" onClick={submit}>SUBMIT TICKET</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
