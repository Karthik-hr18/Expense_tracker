import Income from "../model/incomeModel.js";
import Expense from "../model/expenseModel.js";
import EUser from "../model/authUser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ─── Income ────────────────────────────────────────────────

export const createIncome = async (req, res) => {
  try {
    const newIncome = new Income({
      ...req.body,
      userId: req.user.id,
    });
    const savedData = await newIncome.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllIncome = async (req, res) => {
  try {
    const incomeData = await Income.find({ userId: req.user.id });
    res.status(200).json(incomeData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getTotalIncome = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome = result.length > 0 ? result[0].total : 0;
    res.status(200).json({ totalIncome });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const id = req.params.id;
    const incomeExist = await Income.findOne({ _id: id, userId: req.user.id });
    if (!incomeExist) {
      return res.status(404).json({ message: "Income not found" });
    }
    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// ─── Expense ───────────────────────────────────────────────

export const createExpense = async (req, res) => {
  try {
    const newExpense = new Expense({
      ...req.body,
      userId: req.user.id,
    });
    const savedData = await newExpense.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllExpense = async (req, res) => {
  try {
    const expenseData = await Expense.find({ userId: req.user.id });
    res.status(200).json(expenseData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getTotalExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = result.length > 0 ? result[0].total : 0;
    res.status(200).json({ totalExpense });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const expenseExist = await Expense.findOne({ _id: id, userId: req.user.id });
    if (!expenseExist) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// ─── Balance ───────────────────────────────────────────────

export const balance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const incomeResult = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expenseResult = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
    const bal = totalIncome - totalExpense;

    res.status(200).json({ balance: bal });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// ─── Auth ──────────────────────────────────────────────────

export const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await EUser.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: userExist._id, username: userExist.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    if (!username || !email || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const emailExist = await EUser.findOne({ email: email.toLowerCase() });
    if (emailExist) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const usernameExist = await EUser.findOne({ username });
    if (usernameExist) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new EUser({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Analytics ─────────────────────────────────────────────

export const getMonthlyIncome = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Income.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getMonthlyExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAverageMonthlyIncome = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Income.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          monthlyTotal: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          avgIncome: { $avg: "$monthlyTotal" },
        },
      },
    ]);
    const avgIncome = result[0]?.avgIncome || 0;
    res.status(200).json({ avgIncome });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAverageMonthlyExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const result = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          monthlyTotal: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          avgExpense: { $avg: "$monthlyTotal" },
        },
      },
    ]);
    const avgExpense = result[0]?.avgExpense || 0;
    res.status(200).json({ avgExpense });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Recent 5 Transactions
export const getRecent5Expenses = async (req, res) => {
  try {
    const recent = await Expense.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(5);
    res.status(200).json({ recent });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Highest Expense
export const getHighestExpense = async (req, res) => {
  try {
    const highest = await Expense.findOne({ userId: req.user.id }).sort({
      amount: -1,
    });
    res.status(200).json({ highestExpense: highest || null });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Last Transaction
export const getLastTransaction = async (req, res) => {
  try {
    const last = await Expense.findOne({ userId: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json({ lastTransaction: last || null });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Monthly Comparison (for graph)
export const getMonthlyComparison = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const incomeData = await Income.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    const expenseData = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ incomeData, expenseData });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};