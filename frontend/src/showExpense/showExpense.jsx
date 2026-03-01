import React, { useEffect, useState, useMemo } from "react";
import "./showExpense.css";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";


const Expense = () => {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchTotalExpense = async () => {
      try {
        const res = await api.get("/getTotalExpense");
        setTotalExpense(res.data.totalExpense);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotalExpense();
  }, []);
  const [expense, setExpense] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/expenses");
        setExpense(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const sortedExpenses = useMemo(() => {
    const sorted = [...expense];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "highest":
        return sorted.sort((a, b) => b.amount - a.amount);
      case "lowest":
        return sorted.sort((a, b) => a.amount - b.amount);
      default:
        return sorted;
    }
  }, [expense, sortBy]);

  const deleteExpense = async (userId) => {
    try {
      await api.delete(`/delete/expense/${userId}`);
      setExpense((prevExpense) =>
        prevExpense.filter((item) => item._id !== userId)
      );
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <h1 className="navbar-title"><i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i>Expenses</h1>



      <div className="userTable">
        <div className="buttons-row">
          <Link to="/addExpense" type="button" className="btn btn-primary">
            Add Expense <i className="fa-solid fa-plus"></i>
          </Link>
          <Link to="/" type="button" className="btn btn-secondary">
            DashBoard
          </Link>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort Newest First</option>
            <option value="oldest">Sort Oldest First</option>
            <option value="highest">Sort Highest Expense</option>
            <option value="lowest">Sort Lowest Expense</option>
          </select>

          <h2>Total Expense:₹ {totalExpense}</h2>


        </div>


        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">S.No.</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td><span className="category-badge">{item.category || "Other"}</span></td>
                  <td>₹ {item.amount} <i className="fa-solid fa-arrow-trend-down text-danger"></i></td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td className="actionButtons">

                    <button
                      onClick={() => deleteExpense(item._id)}
                      type="button"
                      className="btn btn-danger"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expense;
