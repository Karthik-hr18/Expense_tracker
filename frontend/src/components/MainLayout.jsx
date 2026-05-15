/*
 * MainLayout Component — Updated with Mobile Sidebar Drawer
 * Changes: Added mobile hamburger menu, sidebar drawer state,
 * and unified navigation for both desktop and mobile.
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../dashboard/dashboard.css";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState(() => {
    const stored = localStorage.getItem("username");
    if (stored) return stored;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload.username || "User";
      } catch (e) {
        return "User";
      }
    }
    return "User";
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername !== username) {
      setUsername(storedUsername);
    }
    // Close sidebar on route change
    setSidebarOpen(false);
  }, [location, username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/UserLogin");
  };

  const navItems = [
    { label: "Dashboard", icon: "fa-house", path: "/Dashboard" },
    { label: "Analytics", icon: "fa-chart-pie", path: "/Analytics" },
    { label: "Expenses", icon: "fa-receipt", path: "/Expenses" },
    { label: "Incomes", icon: "fa-wallet", path: "/Incomes" },
  ];

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar Overlay (Mobile) */}
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fa-solid fa-chart-pie"></i>
          </div>
          <span className="sidebar-brand">ExpenseTracker</span>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="divider" style={{ margin: 'var(--space-md) 0' }}></div>
          <Link to="/AddExpense" className="nav-item">
            <i className="fa-solid fa-plus-circle text-danger"></i>
            <span>Add Expense</span>
          </Link>
          <Link to="/AddIncome" className="nav-item">
            <i className="fa-solid fa-plus-circle text-success"></i>
            <span>Add Income</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', color: 'var(--color-danger)' }}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <div className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <span className="mobile-logo">ET</span>
          </div>
          
          <div className="nav-actions">
            <div className="profile-section">
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>{username}</p>
                <button onClick={handleLogout} style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: 600, border: 'none', background: 'none', padding: 0 }}>
                  Logout
                </button>
              </div>
              <div className="avatar">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content animate-in">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bottom-nav">
        <Link to="/Dashboard" className={`bottom-nav-item ${location.pathname === "/Dashboard" ? "active" : ""}`}>
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>
        <Link to="/Analytics" className={`bottom-nav-item ${location.pathname === "/Analytics" ? "active" : ""}`}>
          <i className="fa-solid fa-chart-pie"></i>
          <span>Stats</span>
        </Link>
        <div className="add-fab-container">
             <Link to="/AddExpense" className="add-btn-mobile">
                <i className="fa-solid fa-plus"></i>
              </Link>
        </div>
        <Link to="/Expenses" className={`bottom-nav-item ${location.pathname === "/Expenses" ? "active" : ""}`}>
          <i className="fa-solid fa-receipt"></i>
          <span>History</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="bottom-nav-item">
          <i className="fa-solid fa-bars"></i>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default MainLayout;
