import React, { useState } from "react";
import MasterLayout from "./MasterLayout";

const PERMISSIONS = [
  { section: "Users", items: [
    { key: "users.view",   label: "View Users"   },
    { key: "users.block",  label: "Block/Unblock" },
    { key: "users.create", label: "Create Users"  },
    { key: "users.delete", label: "Delete Users"  },
  ]},
  { section: "Finance", items: [
    { key: "finance.deposits",    label: "Manage Deposits"    },
    { key: "finance.withdrawals", label: "Manage Withdrawals" },
    { key: "finance.transactions",label: "View Transactions"  },
  ]},
  { section: "Games", items: [
    { key: "games.view",   label: "View Games"    },
    { key: "games.add",    label: "Add Games"     },
    { key: "games.edit",   label: "Edit Games"    },
    { key: "games.toggle", label: "Enable/Disable"},
    { key: "games.delete", label: "Delete Games"  },
  ]},
  { section: "Agents", items: [
    { key: "agents.view",   label: "View Agents"   },
    { key: "agents.create", label: "Create Agents" },
    { key: "agents.block",  label: "Block Agents"  },
  ]},
  { section: "Reports", items: [
    { key: "reports.view",   label: "View Reports"   },
    { key: "reports.export", label: "Export Reports" },
  ]},
  { section: "Settings", items: [
    { key: "settings.view", label: "View Settings"   },
    { key: "settings.edit", label: "Edit Settings"   },
  ]},
];

const DEFAULT_PERMS = {
  master: Object.fromEntries(PERMISSIONS.flatMap(s => s.items.map(i => [i.key, true]))),
  admin:  {
    "users.view": true, "users.block": true, "users.create": true, "users.delete": false,
    "finance.deposits": true, "finance.withdrawals": true, "finance.transactions": true,
    "games.view": true, "games.add": true, "games.edit": true, "games.toggle": true, "games.delete": false,
    "agents.view": true, "agents.create": false, "agents.block": false,
    "reports.view": true, "reports.export": true,
    "settings.view": false, "settings.edit": false,
  },
  agent: {
    "users.view": true, "users.block": false, "users.create": true, "users.delete": false,
    "finance.deposits": false, "finance.withdrawals": false, "finance.transactions": false,
    "games.view": false, "games.add": false, "games.edit": false, "games.toggle": false, "games.delete": false,
    "agents.view": false, "agents.create": false, "agents.block": false,
    "reports.view": true, "reports.export": false,
    "settings.view": false, "settings.edit": false,
  },
};

const ROLES = ["master", "admin", "agent"];

const MasterPermissions = () => {
  const [perms, setPerms] = useState(DEFAULT_PERMS);
  const [saved, setSaved] = useState(false);

  const toggle = (role, key) => {
    if (role === "master") return; // master always has all
    setPerms(p => ({ ...p, [role]: { ...p[role], [key]: !p[role][key] } }));
    setSaved(false);
  };

  return (
    <MasterLayout pageTitle="Roles & Permissions">
      <div className="p-card">
        <div className="p-card-header">
          <h3>Permission Matrix</h3>
          <button className="p-btn p-btn-success" onClick={() => setSaved(true)} style={{ padding: "7px 16px", borderRadius: 6, fontSize: 12 }}>
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
        <div className="p-card-body" style={{ padding: 0 }}>
          <div className="p-table-wrap">
            <table className="p-perm-table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Permission</th>
                  {ROLES.map(r => (
                    <th key={r} style={{ textAlign: "center" }}>
                      <span className={`p-badge ${r}`}>{r.toUpperCase()}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map(section => (
                  <React.Fragment key={section.section}>
                    <tr><td colSpan={4} className="p-perm-section">{section.section}</td></tr>
                    {section.items.map(item => (
                      <tr key={item.key}>
                        <td style={{ color: "#c8d8e8", fontSize: 13 }}>{item.label}</td>
                        {ROLES.map(role => (
                          <td key={role} style={{ textAlign: "center" }}>
                            <label className="p-toggle">
                              <input
                                type="checkbox"
                                checked={!!perms[role][item.key]}
                                onChange={() => toggle(role, item.key)}
                                disabled={role === "master"}
                              />
                              <span className="p-toggle-slider" />
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterPermissions;
