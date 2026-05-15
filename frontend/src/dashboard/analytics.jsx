/*
 * Analytics Component — New
 * Changes: Time period toggles, category breakdown grid,
 * Donut chart for distribution, Line chart for trends.
 */
import React, { useState, useEffect, useMemo } from "react";
import "./dashboard.css";
import "./analytics.css";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#6C63FF", "#EF4444", "#22C55E", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6"];

const Analytics = () => {
  const [period, setPeriod] = useState("Month");
  const [allExpenses, setAllExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, graphRes] = await Promise.all([
          api.get("/expenses"),
          api.get("/analytics/forGraph"),
        ]);
        setAllExpenses(expensesRes.data);
        
        // Merge logic (simplified for this view)
        const incomeData = graphRes.data.incomeData;
        const expenseData = graphRes.data.expenseData;
        const merged = {};
        incomeData.forEach((item) => {
          const key = `${item._id.year}-${item._id.month}`;
          merged[key] = { name: `${item._id.month}/${item._id.year}`, income: item.totalIncome, expense: 0 };
        });
        expenseData.forEach((item) => {
          const key = `${item._id.year}-${item._id.month}`;
          if (merged[key]) merged[key].expense = item.totalExpense;
          else merged[key] = { name: `${item._id.month}/${item._id.year}`, income: 0, expense: item.totalExpense };
        });
        setMonthlyData(Object.values(merged));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const pieData = useMemo(() => {
    const map = {};
    const total = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    allExpenses.forEach((e) => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ 
        name, 
        value, 
        percent: ((value / total) * 100).toFixed(1) 
      }))
      .sort((a, b) => b.value - a.value);
  }, [allExpenses]);

  return (
    <div className="analytics-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
        <div>
          <h1 style={{ marginBottom: "4px" }}>Financial Analytics</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Deep dive into your spending habits.</p>
        </div>
        
        <div className="period-toggle">
          {["Week", "Month", "Year"].map((p) => (
            <button 
              key={p} 
              className={`toggle-btn ${period === p ? "active" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="charts-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--space-lg)" }}>
        {/* Donut Chart */}
        <div className="card" style={{ height: "450px", display: "flex", flexDirection: "column" }}>
          <h3 className="section-title">Expense Distribution</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px" }}
                  formatter={(value) => `₹${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="card" style={{ height: "450px", display: "flex", flexDirection: "column" }}>
          <h3 className="section-title">Spending Trend</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px" }} />
                <Legend />
                <Line type="monotone" dataKey="expense" stroke="var(--color-danger)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-danger)" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="income" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-success)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div style={{ marginTop: "var(--space-2xl)" }}>
        <h3 className="section-title">Category Breakdown</h3>
        <div className="category-breakdown">
          {pieData.map((item, index) => (
            <div key={item.name} className="category-item animate-in">
              <div className="category-dot" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
              <div className="category-label-group">
                <span className="category-name">{item.name}</span>
                <span className="category-percent">{item.percent}% of total spending</span>
              </div>
              <div className="category-amount">₹{item.value.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
