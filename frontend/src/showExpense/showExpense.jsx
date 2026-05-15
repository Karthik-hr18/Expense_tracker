/*
 * Expense History Component — Redesigned
 * Changes: Sticky search bar, category filters, 
 * responsive views (Table for desktop, Cards for mobile).
 */
import React, { useEffect, useState, useMemo } from "react";
import "./showExpense.css";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Food & Dining", "Transport", "Rent & Housing", "Utilities", "Entertainment", "Shopping", "Healthcare", "Education", "Travel", "Other"];

const Expense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, totalRes] = await Promise.all([
        api.get("/expenses"),
        api.get("/getTotalExpense")
      ]);
      setExpenses(expRes.data);
      setTotalExpense(totalRes.data.totalExpense);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, searchTerm, selectedCategory]);

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/delete/expense/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
      toast.success("Expense deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div className="search-bar-container">
          <div className="search-input-wrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search transactions..."
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

      {/* Summary Row */}
      <div style={{ margin: "var(--space-lg) 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Showing {filteredExpenses.length} transactions
        </span>
        <div>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Total: </span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-danger)" }}>₹{totalExpense}</span>
        </div>
      </div>

      {/* Mobile View (Card List) */}
      <div className="mobile-card-list">
        {filteredExpenses.map((item) => (
          <div key={item._id} className="history-item-card">
            <div className="history-item-icon">
              <i className="fa-solid fa-receipt" style={{ color: "var(--color-danger)" }}></i>
            </div>
            <div className="history-item-details">
              <span className="history-item-title">{item.name}</span>
              <div className="history-item-meta">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span className="tag-pill">{item.category || "Other"}</span>
              </div>
            </div>
            <div className="history-item-amount amount-expense">
              - ₹{item.amount}
            </div>
            <button onClick={() => deleteExpense(item._id)} style={{ color: "var(--color-text-muted)", marginLeft: "8px" }}>
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        ))}
        {filteredExpenses.length === 0 && <div className="no-data">No transactions found</div>}
      </div>

      {/* Desktop View (Table) */}
      <div className="desktop-table-view">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td><span className="tag-pill">{item.category || "Other"}</span></td>
                <td style={{ fontWeight: 800, color: "var(--color-danger)" }}>- ₹{item.amount}</td>
                <td>
                  <button onClick={() => deleteExpense(item._id)} className="btn btn-ghost" style={{ padding: "8px", minWidth: "auto", minHeight: "auto" }}>
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

export default Expense;
