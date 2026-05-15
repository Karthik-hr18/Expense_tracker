/*
 * AddIncome Component — Redesigned
 * Changes: Success-themed colors, category chips, 
 * and consistent modal/bottom-sheet layout.
 */
import React, { useState, useEffect } from "react";
import "../addExpense/expense.css";
import "./income.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const INCOME_CATEGORIES = [
  { id: "Salary", icon: "fa-briefcase" },
  { id: "Freelance", icon: "fa-laptop-code" },
  { id: "Business", icon: "fa-store" },
  { id: "Investments", icon: "fa-chart-line" },
  { id: "Rental Income", icon: "fa-building" },
  { id: "Gift", icon: "fa-gift" },
  { id: "Other", icon: "fa-ellipsis" },
];

const AddIncome = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: today,
    category: "Salary",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setIncome({ ...income, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!income.amount || !income.name) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/income", income);
      toast.success("Income added successfully");
      navigate("/Dashboard");
    } catch (error) {
      toast.error("Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-page income-form-page">
      <div className="expense-card">
        <div className="drag-handle"></div>
        <div className="form-header">
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Add Income</h2>
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
                value={income.amount}
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
                {INCOME_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-chip ${income.category === cat.id ? "active" : ""}`}
                    onClick={() => setIncome({ ...income, category: cat.id })}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Name */}
            <div className="input-group">
              <label className="form-label">Income Name</label>
              <input
                type="text"
                name="name"
                value={income.name}
                onChange={inputHandler}
                placeholder="Where did this money come from?"
                autoComplete="off"
              />
            </div>

            {/* Date and Notes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <div className="input-group">
                <label className="form-label">Date</label>
                <input type="date" name="date" value={income.date} onChange={inputHandler} />
              </div>
              <div className="input-group">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={income.notes}
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
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Save Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
