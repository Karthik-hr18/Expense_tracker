/*
 * Dashboard Component — Redesigned (with ALL stats)
 * Changes: Re-added last transaction, avg expense, and avg income.
 * Simplified layout to work with MainLayout.
 */
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../components/sumaryCard";
import "./dashboard.css";
import api from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#6C63FF", "#EF4444", "#22C55E", "#F59E0B", "#3B82F6", "#8B5CF6"];

const Dashboard = () => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [allExpenses, setAllExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [highestExpense, sethighestExpense] = useState(0);
  const [lastExpense, setLastExpense] = useState(0);
  const [avgExpense, setavgExpense] = useState(0);
  const [avgIncome, setavgIncome] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          totalExpRes,
          totalIncRes,
          balRes,
          highRes,
          lastRes,
          avgExpRes,
          avgIncRes,
          graphRes,
          expensesRes,
        ] = await Promise.all([
          api.get("/getTotalExpense"),
          api.get("/getTotalIncome"),
          api.get("/balance"),
          api.get("/analytics/highestExpense"),
          api.get("/analytics/lastTransaction"),
          api.get("/analytics/expenseAvg"),
          api.get("/analytics/incomeAvg"),
          api.get("/analytics/forGraph"),
          api.get("/expenses"),
        ]);

        setTotalExpense(totalExpRes.data.totalExpense);
        setTotalIncome(totalIncRes.data.totalIncome);
        setBalance(balRes.data.balance);
        sethighestExpense(highRes.data.highestExpense);
        setLastExpense(lastRes.data.lastTransaction);
        setavgExpense(avgExpRes.data.avgExpense);
        setavgIncome(avgIncRes.data.avgIncome);
        setAllExpenses(expensesRes.data);

        const merged = mergeMonthlyData(graphRes.data.incomeData, graphRes.data.expenseData);
        setMonthlyData(merged);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAll();
  }, []);

  const mergeMonthlyData = (incomeData, expenseData) => {
    const merged = {};
    incomeData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      merged[key] = { year: item._id.year, month: item._id.month, income: item.totalIncome, expense: 0 };
    });
    expenseData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (merged[key]) merged[key].expense = item.totalExpense;
      else merged[key] = { year: item._id.year, month: item._id.month, income: 0, expense: item.totalExpense };
    });
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Object.values(merged)
      .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))
      .map((item) => ({
        month: monthNames[item.month - 1],
        income: item.income,
        expense: item.expense,
      }));
  };

  const pieData = useMemo(() => {
    const map = {};
    allExpenses.forEach((e) => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allExpenses]);

  return (
    <>
      {/* Welcome Section */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ marginBottom: "4px", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>Welcome, {username}!</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Monitor your finances and track your goals.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="summary-grid">
        <SummaryCard title="Total Balance" amount={balance} color="primary" icon="fa-wallet" />
        <SummaryCard title="Total Income" amount={totalIncome} color="success" icon="fa-arrow-trend-up" />
        <SummaryCard title="Total Expense" amount={totalExpense} color="danger" icon="fa-arrow-trend-down" />
        <SummaryCard title="Highest Expense" amount={highestExpense?.amount} subtitle={highestExpense?.name} color="warning" icon="fa-fire" />
      </div>

      {/* Additional Analytics Stats */}
      <div className="summary-grid" style={{ marginTop: 'var(--space-md)' }}>
        <SummaryCard title="Last Transaction" amount={lastExpense?.amount} subtitle={lastExpense?.name} color="warning" icon="fa-clock-rotate-left" />
        <SummaryCard title="Avg. Expense" amount={avgExpense} subtitle="Per Month" color="danger" icon="fa-chart-simple" />
        <SummaryCard title="Avg. Income" amount={avgIncome} subtitle="Per Month" color="success" icon="fa-chart-line" />
      </div>

      {/* Charts Row */}
      <div className="charts-container">
        <div className="card">
          <h3 className="section-title">Income vs Expense</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="income" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Expense Breakdown</h3>
          <div style={{ height: "300px" }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: "var(--space-2xl)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Recent Activity</h3>
          <Link to="/Expenses" style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontWeight: 600 }}>View All</Link>
        </div>
        <div className="mobile-card-list">
          {allExpenses.slice(0, 5).map((item) => (
            <div key={item._id} className="transaction-card">
              <div className="category-icon" style={{ backgroundColor: "var(--color-danger-bg)", color: "var(--color-danger)" }}>
                <i className="fa-solid fa-receipt"></i>
              </div>
              <div className="transaction-info">
                <span className="transaction-name">{item.name}</span>
                <span className="transaction-date">{new Date(item.date).toLocaleDateString()} • {item.category || "Other"}</span>
              </div>
              <div className="transaction-amount" style={{ color: "var(--color-danger)" }}>- ₹{item.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;