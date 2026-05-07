import React, { useState, useEffect } from "react";
import "./expense.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Rent & Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

const AddExpense = () => {
  const today = new Date().toISOString().split("T")[0];

  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: today,
    category: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!expense.name.trim()) newErrors.name = "Expense name is required";
    if (!expense.amount || Number(expense.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!expense.date) newErrors.date = "Date is required";
    if (!expense.category) newErrors.category = "Select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e, addAnother = false) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post("/expense", expense);
      setToast({ show: true, message: "Expense added successfully! ✓" });

      if (addAnother) {
        setTimeout(() => {
          setExpense({ name: "", amount: "", date: today, category: "", notes: "" });
          setToast({ show: false, message: "" });
        }, 1200);
      } else {
        setTimeout(() => navigate("/Dashboard"), 1200);
      }
    } catch (error) {
      console.log(error);
      setToast({ show: true, message: "Failed to add expense ✕" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      {/* Toast */}
      {toast.show && (
        <div className={`toast-msg ${toast.message.includes("✓") ? "toast-success" : "toast-error"}`}>
          {toast.message}
        </div>
      )}

      <Link to="/Dashboard" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>
        <i className="fa-solid fa-receipt" style={{ marginRight: "8px", color: "#dc3545" }}></i>
        Add New Expense
      </h3>

      <form className="addUserForm" onSubmit={submitForm}>
        {/* Name */}
        <div className="inputGroup">
          <label htmlFor="name">
            <i className="fa-solid fa-tag"></i> Expense Name
          </label>
          <input
            type="text"
            id="name"
            onChange={inputHandler}
            name="name"
            value={expense.name}
            autoComplete="off"
            placeholder="e.g. Groceries, Uber ride"
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Amount */}
        <div className="inputGroup">
          <label htmlFor="amount">
            <i className="fa-solid fa-indian-rupee-sign"></i> Amount
          </label>
          <div className="input-with-prefix">
            <span className="input-prefix">₹</span>
            <input
              type="number"
              id="amount"
              onChange={inputHandler}
              name="amount"
              value={expense.amount}
              autoComplete="off"
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.amount ? "input-error" : ""}
            />
          </div>
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        {/* Category */}
        <div className="inputGroup">
          <label htmlFor="category">
            <i className="fa-solid fa-layer-group"></i> Category
          </label>
          <select
            id="category"
            name="category"
            value={expense.category}
            onChange={inputHandler}
            className={errors.category ? "input-error" : ""}
          >
            <option value="">-- Select Category --</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Date */}
        <div className="inputGroup">
          <label htmlFor="date">
            <i className="fa-solid fa-calendar-days"></i> Date
          </label>
          <input
            type="date"
            id="date"
            onChange={inputHandler}
            name="date"
            value={expense.date}
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        {/* Notes */}
        <div className="inputGroup">
          <label htmlFor="notes">
            <i className="fa-solid fa-pen-to-square"></i> Notes <span className="optional-tag">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={expense.notes}
            onChange={inputHandler}
            placeholder="Any extra details..."
            rows="3"
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
            ) : (
              <><i className="fa-solid fa-check"></i> Submit</>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={isLoading}
            onClick={(e) => submitForm(e, true)}
          >
            <i className="fa-solid fa-plus"></i> Save & Add Another
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
