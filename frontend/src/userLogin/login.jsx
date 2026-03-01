import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const Login = () => {
    const [user, setUser] = useState({
        identifier: "",
        password: "",
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
            const response = await api.post("/login", user);
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message, { position: "top-right" });
            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login failed",
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
                        <i className="fa-solid fa-right-to-bracket"></i>
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to manage your expenses</p>
                </div>

                <form className="auth-form" onSubmit={submitForm}>
                    <div className="input-group">
                        <label htmlFor="identifier">
                            <i className="fa-solid fa-at"></i> Username or Email
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            onChange={inputHandler}
                            name="identifier"
                            autoComplete="off"
                            placeholder="Enter your username or email"
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin"></i> Signing In...</span>
                        ) : (
                            <span><i className="fa-solid fa-right-to-bracket"></i> Sign In</span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/UserRegister">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
