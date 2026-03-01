import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const PIE_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#06b6d4",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalExpense, setTotalExpense] = useState(0);
  const [allExpenses, setAllExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [Balance, setBalance] = useState(0);
  const [lastExpense, setLastExpense] = useState(0);
  const [highestExpense, sethighestExpense] = useState(0);
  const [avgExpense, setavgExpense] = useState(0);
  const [avgIncome, setavgIncome] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/UserLogin");
    }
  }, [navigate]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          totalExpRes,
          totalIncRes,
          balRes,
          lastRes,
          highRes,
          avgExpRes,
          avgIncRes,
          graphRes,
          expensesRes,
        ] = await Promise.all([
          api.get("/getTotalExpense"),
          api.get("/getTotalIncome"),
          api.get("/balance"),
          api.get("/analytics/lastTransaction"),
          api.get("/analytics/highestExpense"),
          api.get("/analytics/expenseAvg"),
          api.get("/analytics/incomeAvg"),
          api.get("/analytics/forGraph"),
          api.get("/expenses"),
        ]);

        setTotalExpense(totalExpRes.data.totalExpense);
        setTotalIncome(totalIncRes.data.totalIncome);
        setBalance(balRes.data.balance);
        setLastExpense(lastRes.data.lastTransaction);
        sethighestExpense(highRes.data.highestExpense);
        setavgExpense(avgExpRes.data.avgExpense);
        setavgIncome(avgIncRes.data.avgIncome);
        setAllExpenses(expensesRes.data);

        const merged = mergeMonthlyData(
          graphRes.data.incomeData,
          graphRes.data.expenseData
        );
        setMonthlyData(merged);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/UserLogin");
  };

  const mergeMonthlyData = (incomeData, expenseData) => {
    const merged = {};

    incomeData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      merged[key] = {
        year: item._id.year,
        month: item._id.month,
        income: item.totalIncome,
        expense: 0,
      };
    });

    expenseData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;

      if (merged[key]) {
        merged[key].expense = item.totalExpense;
      } else {
        merged[key] = {
          year: item._id.year,
          month: item._id.month,
          income: 0,
          expense: item.totalExpense,
        };
      }
    });

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return Object.values(merged)
      .sort((a, b) =>
        a.year === b.year ? a.month - b.month : a.year - b.year
      )
      .map((item) => ({
        month: monthNames[item.month - 1],
        income: item.income,
        expense: item.expense,
      }));
  };

  // Aggregate expenses by category for pie chart
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <i className="fa-solid fa-chart-line" style={{ marginRight: "10px" }}></i>
          Dashboard
        </h1>
        <button className="btn btn-logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="summary">
        <div className="card income">
          <h3>Total Income</h3>
          <p>₹ {totalIncome}</p>
        </div>

        <div className="card expense">
          <h3>Total Expense</h3>
          <p>₹ {totalExpense}</p>
        </div>

        <div className="card balance">
          <h3>Available Balance</h3>
          <p>₹ {Balance}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions">
        <Link to="/AddIncome" className="btn btn-income">
          <i className="fa-solid fa-plus"></i> Add Income
        </Link>

        <Link to="/AddExpense" className="btn btn-expense">
          <i className="fa-solid fa-plus"></i> Add Expense
        </Link>

        <Link to="/Expenses" className="btn btn-view-expense">
          <i className="fa-solid fa-arrow-trend-down"></i> View Expenses
        </Link>

        <Link to="/Incomes" className="btn btn-view-income">
          <i className="fa-solid fa-arrow-trend-up"></i> View Incomes
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-section">
        <h2 className="section-title">Analytics Overview</h2>
        <div className="analytics-grid">
          <SummaryCard
            title="Highest Expense"
            amount={highestExpense?.amount}
            subtitle={highestExpense?.name}
            color="danger"
          />
          <SummaryCard
            title="Last Transaction"
            amount={lastExpense?.amount}
            subtitle={lastExpense?.name}
            color="warning"
          />
          <SummaryCard
            title="Avg. Expense"
            amount={avgExpense}
            subtitle="Per transaction"
            color="danger"
          />
          <SummaryCard
            title="Avg. Income"
            amount={avgIncome}
            subtitle="Per transaction"
            color="success"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h2 className="section-title">Monthly Income vs Expense</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#28a745" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#dc3545" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart + Line Chart Row */}
      <div className="charts-row">
        {/* Pie Chart — Expense Distribution */}
        <div className="chart-section chart-half">
          <h2 className="section-title">Expense Distribution</h2>
          <div className="chart-container">
            {pieData.length > 0 ? (
              <div className="pie-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹ ${value}`}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="pie-legend-item">
                      <span
                        className="pie-legend-dot"
                        style={{
                          background: PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      ></span>
                      <span className="pie-legend-label">{entry.name}</span>
                      <span className="pie-legend-value">₹ {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="no-data">No expense data yet</p>
            )}
          </div>
        </div>

        {/* Line Chart — Financial Trend */}
        <div className="chart-section chart-half">
          <h2 className="section-title">Financial Trend</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  formatter={(value) => `₹ ${value}`}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#28a745"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#28a745" }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#dc3545"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#dc3545" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;