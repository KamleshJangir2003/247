import React, { useState } from "react";
import MasterLayout from "./MasterLayout";

const MasterSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "777GAMES",
    siteUrl: "https://777games.com",
    supportEmail: "support@777games.com",
    minDeposit: "100",
    maxDeposit: "100000",
    minWithdrawal: "200",
    maxWithdrawal: "50000",
    maintenanceMode: false,
    registrationOpen: true,
    demoLoginEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  const set = (key, val) => { setSettings(s => ({ ...s, [key]: val })); setSaved(false); };

  return (
    <MasterLayout pageTitle="Settings">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Platform Settings</h3>
          <button className="p-btn p-btn-success" onClick={() => setSaved(true)} style={{ padding: "7px 16px", borderRadius: 6, fontSize: 12 }}>
            {saved ? "✓ Saved" : "Save Settings"}
          </button>
        </div>
        <div className="p-card-body">
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#4a6a8a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Site Info</p>
            <div className="p-form-grid">
              <div className="p-form-group"><label>Site Name</label><input value={settings.siteName} onChange={e => set("siteName", e.target.value)} /></div>
              <div className="p-form-group"><label>Site URL</label><input value={settings.siteUrl} onChange={e => set("siteUrl", e.target.value)} /></div>
              <div className="p-form-group full"><label>Support Email</label><input value={settings.supportEmail} onChange={e => set("supportEmail", e.target.value)} /></div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#4a6a8a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Finance Limits</p>
            <div className="p-form-grid">
              <div className="p-form-group"><label>Min Deposit (₹)</label><input type="number" value={settings.minDeposit} onChange={e => set("minDeposit", e.target.value)} /></div>
              <div className="p-form-group"><label>Max Deposit (₹)</label><input type="number" value={settings.maxDeposit} onChange={e => set("maxDeposit", e.target.value)} /></div>
              <div className="p-form-group"><label>Min Withdrawal (₹)</label><input type="number" value={settings.minWithdrawal} onChange={e => set("minWithdrawal", e.target.value)} /></div>
              <div className="p-form-group"><label>Max Withdrawal (₹)</label><input type="number" value={settings.maxWithdrawal} onChange={e => set("maxWithdrawal", e.target.value)} /></div>
            </div>
          </div>

          <div>
            <p style={{ color: "#4a6a8a", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Platform Toggles</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "maintenanceMode",   label: "Maintenance Mode",     desc: "Blocks all user access" },
                { key: "registrationOpen",  label: "Registration Open",    desc: "Allow new user signups" },
                { key: "demoLoginEnabled",  label: "Demo Login Enabled",   desc: "Allow demo account login" },
              ].map(t => (
                <div key={t.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a0f1a", border: "1px solid #1a2a3a", borderRadius: 8, padding: "12px 16px" }}>
                  <div>
                    <div style={{ color: "#c8d8e8", fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                    <div style={{ color: "#4a6a8a", fontSize: 11 }}>{t.desc}</div>
                  </div>
                  <label className="p-toggle">
                    <input type="checkbox" checked={settings[t.key]} onChange={e => set(t.key, e.target.checked)} />
                    <span className="p-toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterSettings;
