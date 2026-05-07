import React, { useEffect, useState, useMemo } from "react";
import "./showIncome.css";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";


const Income = () => {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/UserLogin");
  }, [navigate]);

  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const res = await api.get("/getTotalIncome");
        setTotalIncome(res.data.totalIncome);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotalIncome();
  }, []);
  const [income, setIncome] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/incomes");
        setIncome(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const sortedIncomes = useMemo(() => {
    const sorted = [...income];
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
  }, [income, sortBy]);

  const deleteIncome = async (userId) => {
    try {
      await api.delete(`/delete/income/${userId}`);
      setIncome((prevUser) => prevUser.filter((user) => user._id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="navbar-title"><i className="fa-solid fa-user" style={{ marginRight: "8px" }}></i>Incomes</h1>



      <div className="userTable">
        <div className="buttons-row">
          <Link to="/addIncome" type="button" className="btn btn-primary">
            Add Income <i className="fa-solid fa-plus"></i>
          </Link>
          <Link to="/Dashboard" type="button" className="btn btn-secondary">
            DashBoard
          </Link>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort Newest First</option>
            <option value="oldest">Sort Oldest First</option>
            <option value="highest">Sort Highest Income</option>
            <option value="lowest">Sort Lowest Income</option>
          </select>

          <h2>Total Income:₹ {totalIncome}</h2>


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
            {sortedIncomes.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td><span className="category-badge">{item.category || "Other"}</span></td>
                  <td>₹ {item.amount} <i className="fa-solid fa-arrow-trend-up text-success"></i> </td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td className="actionButtons">

                    <button
                      onClick={() => deleteIncome(item._id)}
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

export default Income;
