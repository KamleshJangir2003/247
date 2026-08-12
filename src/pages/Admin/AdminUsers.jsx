import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminManage.css";

const INIT_USERS = [
  { id: 1, username: "km****1851", name: "Kamal Singh",  email: "kamal@mail.com", mobile: "98765XXXXX", balance: "₹5,000",  joined: "01 Jan 2024", status: "active"  },
  { id: 2, username: "ra****7734", name: "Ravi Sharma",  email: "ravi@mail.com",  mobile: "91234XXXXX", balance: "₹12,500", joined: "15 Feb 2024", status: "active"  },
  { id: 3, username: "su****3312", name: "Suresh Kumar", email: "suresh@mail.com",mobile: "87654XXXXX", balance: "₹800",   joined: "10 Mar 2024", status: "blocked" },
  { id: 4, username: "vi****9901", name: "Vikas Yadav",  email: "vikas@mail.com", mobile: "99887XXXXX", balance: "₹3,200", joined: "20 Mar 2024", status: "active"  },
  { id: 5, username: "mo****4421", name: "Mohit Gupta",  email: "mohit@mail.com", mobile: "77665XXXXX", balance: "₹9,700", joined: "02 Apr 2024", status: "active"  },
  { id: 6, username: "pr****6672", name: "Priya Patel",  email: "priya@mail.com", mobile: "88990XXXXX", balance: "₹2,100", joined: "18 Apr 2024", status: "active"  },
  { id: 7, username: "an****2244", name: "Ankit Joshi",  email: "ankit@mail.com", mobile: "96543XXXXX", balance: "₹450",   joined: "05 May 2024", status: "blocked" },
];

const PAGE_SIZE = 5;

const AdminUsers = () => {
  const [users, setUsers]     = useState(INIT_USERS);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [page, setPage]       = useState(1);

  const toggle = (id) => setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));

  const filtered = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase()) || u.mobile.includes(search);
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const active  = users.filter(u => u.status === "active").length;
  const blocked = users.filter(u => u.status === "blocked").length;

  return (
    <AdminLayout pageTitle="User Management">

      <div className="adm-summary-row">
        <div className="adm-sum-card"><p>Total Users</p><h4>{users.length}</h4></div>
        <div className="adm-sum-card"><p>Active</p><h4 style={{color:"#4ade80"}}>{active}</h4></div>
        <div className="adm-sum-card"><p>Blocked</p><h4 style={{color:"#f87171"}}>{blocked}</h4></div>
      </div>

      <div className="adm-mgmt-header">
        <span className="adm-mgmt-title">All Users</span>
        <div className="adm-search-bar">
          <input
            type="text"
            placeholder="Search by name / username / mobile"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 260 }}
          />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Mobile</th>
              <th>Balance</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={8} className="adm-nodata">No users found.</td></tr>
            ) : paginated.map((u, i) => (
              <tr key={u.id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td style={{ color: "#c0d0e0", fontWeight: 600 }}>{u.username}</td>
                <td>{u.name}</td>
                <td>{u.mobile}</td>
                <td style={{ color: "#4ade80", fontWeight: 600 }}>{u.balance}</td>
                <td>{u.joined}</td>
                <td><span className={`adm-badge ${u.status}`}>{u.status}</span></td>
                <td>
                  <div className="adm-action-btns">
                    {u.status === "active"
                      ? <button className="adm-btn-block"   onClick={() => toggle(u.id)}>Block</button>
                      : <button className="adm-btn-unblock" onClick={() => toggle(u.id)}>Unblock</button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="adm-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

    </AdminLayout>
  );
};

export default AdminUsers;
