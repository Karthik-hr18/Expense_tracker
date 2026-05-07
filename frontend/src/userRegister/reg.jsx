import React, { useState } from "react";
import "./reg.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/register", user);
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message, { position: "top-right" });
            navigate("/Dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration failed",
                { position: "top-right" }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <h2>Create Account</h2>
                    <p>Start tracking your expenses today</p>
                </div>

                <form className="auth-form" onSubmit={submitForm}>
                    <div className="input-group">
                        <label htmlFor="username">
                            <i className="fa-solid fa-user"></i> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            onChange={inputHandler}
                            name="username"
                            autoComplete="off"
                            placeholder="Choose a username"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">
                            <i className="fa-solid fa-envelope"></i> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={inputHandler}
                            name="email"
                            autoComplete="off"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <i className="fa-solid fa-lock"></i> Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={inputHandler}
                            name="password"
                            autoComplete="off"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirm_password">
                            <i className="fa-solid fa-shield-halved"></i> Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            onChange={inputHandler}
                            name="confirm_password"
                            autoComplete="off"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin"></i> Creating Account...</span>
                        ) : (
                            <span><i className="fa-solid fa-user-plus"></i> Register</span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/UserLogin">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
