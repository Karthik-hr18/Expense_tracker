/*
 * Income History Component — Redesigned
 * Changes: Success-themed, sticky search, category filters, 
 * and responsive views.
 */
import React, { useEffect, useState, useMemo } from "react";
import "../showExpense/showExpense.css";
import "./showIncome.css";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Salary", "Freelance", "Business", "Investments", "Rental Income", "Gift", "Refund", "Other"];

const Income = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [incRes, totalRes] = await Promise.all([
        api.get("/incomes"),
        api.get("/getTotalIncome")
      ]);
      setIncomes(incRes.data);
      setTotalIncome(totalRes.data.totalIncome);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load incomes");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredIncomes = useMemo(() => {
    return incomes.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes, searchTerm, selectedCategory]);

  const deleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;
    try {
      await api.delete(`/delete/income/${id}`);
      setIncomes(incomes.filter((e) => e._id !== id));
      toast.success("Income deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="history-page income-history">
      <div className="history-header">
        <div className="search-bar-container">
          <div className="search-input-wrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search income sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-scroll-container">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: "var(--space-lg) 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Showing {filteredIncomes.length} records
        </span>
        <div>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Total: </span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-success)" }}>₹{totalIncome}</span>
        </div>
      </div>

      <div className="mobile-card-list">
        {filteredIncomes.map((item) => (
          <div key={item._id} className="history-item-card">
            <div className="history-item-icon">
              <i className="fa-solid fa-wallet" style={{ color: "var(--color-success)" }}></i>
            </div>
            <div className="history-item-details">
              <span className="history-item-title">{item.name}</span>
              <div className="history-item-meta">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span className="tag-pill">{item.category || "Other"}</span>
              </div>
            </div>
            <div className="history-item-amount amount-income">
              + ₹{item.amount}
            </div>
            <button onClick={() => deleteIncome(item._id)} style={{ color: "var(--color-text-muted)", marginLeft: "8px" }}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
        {filteredIncomes.length === 0 && <div className="no-data">No records found</div>}
      </div>

      <div className="desktop-table-view">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncomes.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td><span className="tag-pill">{item.category || "Other"}</span></td>
                <td style={{ fontWeight: 800, color: "var(--color-success)" }}>+ ₹{item.amount}</td>
                <td>
                  <button onClick={() => deleteIncome(item._id)} className="btn btn-ghost" style={{ padding: "8px", minWidth: "auto", minHeight: "auto" }}>
                    <i className="fa-solid fa-trash-can" style={{ color: "var(--color-danger)" }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Income;
