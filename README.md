# 💰 Expense Tracker

A full-stack **MERN** (MongoDB, Express, React, Node.js) expense tracker with **per-user authentication**, interactive analytics, and a modern dashboard.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)

---

## ✨ Features

- **🔐 User Authentication** — Register & login with username or email, JWT-based sessions
- **👤 Per-User Data** — Each user has their own private income, expenses & analytics
- **📊 Interactive Dashboard** — Summary cards, bar charts, pie charts & line charts (Recharts)
- **💵 Income & Expense Tracking** — Add, view, sort & delete transactions with categories
- **📈 Analytics** — Monthly trends, averages, highest expense, recent transactions
- **🔒 Protected Routes** — All pages require authentication; unauthorized users are redirected to login
- **🚪 Logout** — Clears session and redirects to login

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, Recharts, Axios, Bootstrap 5, react-hot-toast |
| **Backend** | Node.js, Express 5, Mongoose, bcrypt, jsonwebtoken |
| **Database** | MongoDB |
| **Auth** | JWT (JSON Web Tokens) with Bearer token headers |

---

## 📁 Project Structure

```
Expense/
├── backend/
│   ├── controller/
│   │   └── controllers.js      # All API logic (CRUD + auth + analytics)
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── model/
│   │   ├── authUser.js         # User schema (username, email, password)
│   │   ├── incomeModel.js      # Income schema (userId, name, amount, date, category)
│   │   └── expenseModel.js     # Expense schema (userId, name, amount, date, category)
│   ├── route/
│   │   └── routes.js           # API routes (protected with auth middleware)
│   ├── .env                    # Environment variables
│   ├── index.js                # Express server entry point
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── addExpense/         # Add expense form
│       ├── addIncome/          # Add income form
│       ├── components/         # Reusable components (SummaryCard)
│       ├── dashboard/          # Main dashboard with charts & analytics
│       ├── showExpense/        # Expense list with sort & delete
│       ├── showIncome/         # Income list with sort & delete
│       ├── userLogin/          # Login page (username or email)
│       ├── userRegister/       # Registration page
│       ├── api.js              # Axios instance with JWT interceptor
│       ├── App.js              # Routes & Toaster setup
│       └── index.js            # React entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or a cloud instance like MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Karthik-hr18/Expense-tracker.git
cd expense-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=8000
MONGO_URL="mongodb://localhost:27017/MERN"
JWT_SECRET="your_secret_key_here"
```

Start the backend server:

```bash
npx nodemon index.js
```

> The server will start on `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

> The app will open at `http://localhost:3000`

---

## 🔑 API Endpoints

### Auth (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Login with username or email |

### Income (Protected — requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/income` | Add new income |
| `GET` | `/api/incomes` | Get all incomes for logged-in user |
| `GET` | `/api/getTotalIncome` | Get total income |
| `DELETE` | `/api/delete/income/:id` | Delete an income entry |

### Expense (Protected — requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/expense` | Add new expense |
| `GET` | `/api/expenses` | Get all expenses for logged-in user |
| `GET` | `/api/getTotalExpense` | Get total expense |
| `DELETE` | `/api/delete/expense/:id` | Delete an expense entry |

### Analytics (Protected — requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/balance` | Get available balance |
| `GET` | `/api/analytics/incomeAvg` | Average monthly income |
| `GET` | `/api/analytics/expenseAvg` | Average monthly expense |
| `GET` | `/api/analytics/monthlyIncome` | Monthly income breakdown |
| `GET` | `/api/analytics/monthlyExpense` | Monthly expense breakdown |
| `GET` | `/api/analytics/highestExpense` | Highest single expense |
| `GET` | `/api/analytics/lastTransaction` | Most recent transaction |
| `GET` | `/api/analytics/getRecentExpense` | Last 5 expenses |
| `GET` | `/api/analytics/forGraph` | Monthly comparison data for charts |

---

## 🔒 Authentication Flow

```
1. User registers → password hashed with bcrypt → saved to MongoDB
2. User logs in (username or email) → server returns JWT token (7-day expiry)
3. Token stored in localStorage → attached to every API request via Axios interceptor
4. Backend middleware verifies JWT → extracts userId → scopes all queries
5. Logout clears token → redirects to login page
```

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Register | `/UserRegister` | Create account with username, email & password |
| Login | `/UserLogin` | Sign in with username or email |
| Dashboard | `/` | Summary cards, charts & analytics |
| Add Income | `/AddIncome` | Form to add income with category |
| Add Expense | `/AddExpense` | Form to add expense with category |
| View Incomes | `/Incomes` | Sortable income table with delete |
| View Expenses | `/Expenses` | Sortable expense table with delete |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
