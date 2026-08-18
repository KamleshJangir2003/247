import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import AccountSidebar from "../../components/AccountSidebar";
import Footer from "../../components/Footer";
import { updateUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", dob: "", city: "", state: "" });
  const [userId, setUserId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setUserId(authUser.id);
      setForm({
        name:   authUser.name  || "",
        email:  authUser.email || "",
        mobile: authUser.mobile || "",
        dob:    authUser.dob   || "",
        city:   authUser.city  || "",
        state:  authUser.state || "",
      });
    }
    setLoading(false);
  }, [authUser]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!userId) return;
    const [firstName, ...rest] = form.name.trim().split(" ");
    const res = await updateUser(userId, {
      firstName,
      lastName: rest.join(" "),
      email:    form.email,
      phone:    form.mobile,
    });
    if (res?.success) {
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMsg({ type: "error", text: res?.message || "Update failed." });
    }
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

          {loading ? (
            <div style={{ color: "#7a9ab8", padding: 20 }}>Loading…</div>
          ) : (
            <>
              <div className="profile-card">
                <div className="profile-avatar">👤</div>
                <div className="profile-username">{authUser?.username || "—"}</div>
              </div>

              <div className="profile-form">
                {[
                  { label: "Full Name",     name: "name",   type: "text"  },
                  { label: "Email",         name: "email",  type: "email" },
                  { label: "Mobile",        name: "mobile", type: "text"  },
                  { label: "Date of Birth", name: "dob",    type: "text"  },
                  { label: "City",          name: "city",   type: "text"  },
                  { label: "State",         name: "state",  type: "text"  },
                ].map(f => (
                  <div className="p-form-group" key={f.name}>
                    <label>{f.label}</label>
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handle} />
                  </div>
                ))}
                <button className="p-save-btn" onClick={save}>SAVE CHANGES</button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
