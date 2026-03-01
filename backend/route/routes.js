import express from "express";
import { balance, createExpense, createIncome, deleteExpense, deleteIncome, getAllExpense, getAllIncome, getAverageMonthlyExpense, getAverageMonthlyIncome, getHighestExpense, getLastTransaction, getMonthlyComparison, getMonthlyExpense, getMonthlyIncome, getRecent5Expenses, getTotalExpense, getTotalIncome, userLogin, userRegister } from "../controller/controllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const route = express.Router();

// Auth routes (no middleware)
route.post("/login", userLogin);
route.post("/register", userRegister);

// Protected data routes
route.post("/income", authMiddleware, createIncome);
route.post("/expense", authMiddleware, createExpense);
route.get("/incomes", authMiddleware, getAllIncome);
route.get("/expenses", authMiddleware, getAllExpense);
route.delete("/delete/income/:id", authMiddleware, deleteIncome);
route.delete("/delete/expense/:id", authMiddleware, deleteExpense);
route.get("/getTotalIncome", authMiddleware, getTotalIncome);
route.get("/getTotalExpense", authMiddleware, getTotalExpense);
route.get("/balance", authMiddleware, balance);
route.get("/analytics/incomeAvg", authMiddleware, getAverageMonthlyIncome);
route.get("/analytics/expenseAvg", authMiddleware, getAverageMonthlyExpense);
route.get("/analytics/monthlyIncome", authMiddleware, getMonthlyIncome);
route.get("/analytics/monthlyExpense", authMiddleware, getMonthlyExpense);
route.get("/analytics/getRecentExpense", authMiddleware, getRecent5Expenses);
route.get("/analytics/lastTransaction", authMiddleware, getLastTransaction);
route.get("/analytics/highestExpense", authMiddleware, getHighestExpense);
route.get("/analytics/forGraph", authMiddleware, getMonthlyComparison);

export default route;