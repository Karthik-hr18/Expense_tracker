/*
 * AddExpense Component — Redesigned
 * Changes: Modal/Bottom-sheet layout, category chips with icons,
 * giant amount input, and mobile-optimized interactions.
 */
import React, { useState, useEffect } from "react";
import "./expense.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "Food & Dining", icon: "fa-utensils" },
  { id: "Transport", icon: "fa-car" },
  { id: "Rent & Housing", icon: "fa-house" },
  { id: "Utilities", icon: "fa-bolt" },
  { id: "Entertainment", icon: "fa-clapperboard" },
  { id: "Shopping", icon: "fa-bag-shopping" },
  { id: "Healthcare", icon: "fa-heart-pulse" },
  { id: "Education", icon: "fa-book" },
  { id: "Travel", icon: "fa-plane" },
  { id: "Other", icon: "fa-ellipsis" },
];

const AddExpense = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: today,
    category: "Food & Dining",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!expense.amount || !expense.name) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/expense", expense);
      toast.success("Expense added successfully");
      navigate("/Dashboard");
    } catch (error) {
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-page">
      <div className="expense-card">
        <div className="drag-handle"></div>
        <div className="form-header">
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Add Expense</h2>
          <Link to="/Dashboard" style={{ color: "var(--color-text-muted)" }}>
            <i className="fa-solid fa-xmark fa-lg"></i>
          </Link>
        </div>

        <form onSubmit={submitForm}>
          {/* Amount Display */}
          <div className="amount-wrapper">
            <span className="form-label" style={{ marginBottom: "8px" }}>Amount</span>
            <div className="amount-input-container">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                name="amount"
                value={expense.amount}
                onChange={inputHandler}
                className="amount-input-giant"
                placeholder="0"
                autoFocus
              />
            </div>
          </div>

          <div className="form-body">
            {/* Category Chips */}
            <div>
              <span className="form-label">Category</span>
              <div className="category-scroll-grid">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-chip ${expense.category === cat.id ? "active" : ""}`}
                    onClick={() => setExpense({ ...expense, category: cat.id })}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Name */}
            <div className="input-group">
              <label className="form-label">Expense Name</label>
              <input
                type="text"
                name="name"
                value={expense.name}
                onChange={inputHandler}
                placeholder="What did you spend on?"
                autoComplete="off"
              />
            </div>

            {/* Date and Notes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <div className="input-group">
                <label className="form-label">Date</label>
                <input type="date" name="date" value={expense.date} onChange={inputHandler} />
              </div>
              <div className="input-group">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={expense.notes}
                  onChange={inputHandler}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/Dashboard")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
