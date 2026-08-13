import React from "react";
import AdminLayout from "./AdminLayout";

const PERMISSIONS = [
  { section: "Users",   items: [{ label: "View Users", val: true }, { label: "Block/Unblock", val: true }, { label: "Create Users", val: true }, { label: "Delete Users", val: false }] },
  { section: "Finance", items: [{ label: "Manage Deposits", val: true }, { label: "Manage Withdrawals", val: true }, { label: "View Transactions", val: true }] },
  { section: "Games",   items: [{ label: "View Games", val: true }, { label: "Add Games", val: true }, { label: "Edit Games", val: true }, { label: "Enable/Disable", val: true }, { label: "Delete Games", val: false }] },
  { section: "Agents",  items: [{ label: "View Agents", val: true }, { label: "Create Agents", val: false }, { label: "Block Agents", val: false }] },
  { section: "Reports", items: [{ label: "View Reports", val: true }, { label: "Export Reports", val: true }] },
  { section: "Settings",items: [{ label: "View Settings", val: false }, { label: "Edit Settings", val: false }] },
];

const AdminPermissions = () => (
  <AdminLayout pageTitle="My Permissions">
    <div className="p-card">
      <div className="p-card-header">
        <h3>Admin Permission Matrix</h3>
        <span style={{ fontSize: 11, color: "#4a6a8a" }}>Managed by Master. Contact master to change permissions.</span>
      </div>
      <div className="p-card-body" style={{ padding: 0 }}>
        <div className="p-table-wrap">
          <table className="p-perm-table">
            <thead>
              <tr>
                <th style={{ width: "60%" }}>Permission</th>
                <th style={{ textAlign: "center" }}><span className="p-badge admin">ADMIN</span></th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(section => (
                <React.Fragment key={section.section}>
                  <tr><td colSpan={2} className="p-perm-section">{section.section}</td></tr>
                  {section.items.map(item => (
                    <tr key={item.label}>
                      <td style={{ color: "#c8d8e8", fontSize: 13 }}>{item.label}</td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: item.val ? "#4ade80" : "#f87171", fontSize: 16 }}>{item.val ? "✓" : "✗"}</span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminPermissions;
