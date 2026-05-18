/*
 * Login page — redesigned
 * Changes: Split-panel layout, branded left panel, 
 * modern form card, gradient CTA, no Bootstrap dependency
 */
import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const Login = () => {
    const [user, setUser] = useState({ identifier: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            localStorage.setItem("username", response.data.user.username);
            toast.success(response.data.message, { position: "top-right" });
            navigate("/Dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Mobile Header Strip */}
            <div className="auth-mobile-header">
                <div className="logo-mark">
                    <i className="fa-solid fa-chart-pie"></i>
                </div>
                <span>ExpenseTracker</span>
            </div>

            {/* Left Branded Panel */}
            <div className="auth-brand-panel">
                <div className="auth-brand-logo">
                    <div className="logo-icon">
                        <i className="fa-solid fa-chart-pie" style={{ color: '#fff' }}></i>
                    </div>
                    <span className="brand-name">ExpenseTracker</span>
                </div>

                <h2 className="auth-brand-tagline">Take control of your finances</h2>
                <p className="auth-brand-sub">
                    Track spending, analyze habits, and build a better financial future — all in one place.
                </p>

                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <i className="fa-solid fa-chart-line"></i>
                        <span>Real-time analytics &amp; insights</span>
                    </div>
                    <div className="auth-brand-feature">
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>Secure &amp; private by design</span>
                    </div>
                    <div className="auth-brand-feature">
                        <i className="fa-solid fa-bolt"></i>
                        <span>Log expenses in seconds</span>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-card animate-in">
                    <div className="auth-header">
                        <Link to="/" className="auth-back-link">
                            <i className="fa-solid fa-arrow-left"></i> Back to Home
                        </Link>
                        <div className="auth-icon-wrap">
                            <i className="fa-solid fa-right-to-bracket"></i>
                        </div>
                        <h2>Welcome back</h2>
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
                                name="identifier"
                                onChange={inputHandler}
                                autoComplete="off"
                                placeholder="Enter your username or email"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">
                                <i className="fa-solid fa-lock"></i> Password
                            </label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    onChange={inputHandler}
                                    autoComplete="off"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="forgot-link">
                            <Link to="/ComingSoon">Forgot password?</Link>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading} id="login-submit-btn">
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Signing In...</>
                            ) : (
                                <><i className="fa-solid fa-right-to-bracket"></i> Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account?{" "}<Link to="/UserRegister">Create Account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
