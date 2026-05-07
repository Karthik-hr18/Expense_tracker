import AddExpense from "./addExpense/expense";
import AddIncome from "./addIncome/income";
import "./App.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Expense from "./showExpense/showExpense";
import Income from "./showIncome/showIncome";
import Dashboard from "./dashboard/dashboard";
import Login from "./userLogin/login";
import Register from "./userRegister/reg";
import Home from "./home/Home";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Dashboard",
    element: <Dashboard />,
  },
  {
    path: "/Incomes",
    element: <Income />,
  },
  {
    path: "/Expenses",
    element: <Expense />,
  },
  {
    path: "/AddExpense",
    element: <AddExpense />,
  },
  {
    path: "/AddIncome",
    element: <AddIncome />,
  },
  {
    path: "/UserLogin",
    element: <Login />,
  },
  {
    path: "/UserRegister",
    element: <Register />,
  },
]);

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
