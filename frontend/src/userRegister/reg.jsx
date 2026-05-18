/*
 * Register page — redesigned
 * Changes: Same split-panel as login, password strength bar,
 * inline validation, reuses auth shared CSS
 */
import React, { useState } from "react";
import "../userLogin/login.css";
import "./reg.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

const Register = () => {
    const [user, setUser] = useState({ username: "", email: "", password: "", confirm_password: "" });
    const [loading, setLoading] = useState(false);
    const [pwdStrength, setPwdStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        if (name === 'password') setPwdStrength(getStrength(value));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/register", user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.user.username);
            toast.success(response.data.message, { position: "top-right" });
            navigate("/Dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed", { position: "top-right" });
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
                <h2 className="auth-brand-tagline">Join thousands managing their money smarter</h2>
                <p className="auth-brand-sub">
                    Sign up free and start tracking your expenses, income, and savings in under 2 minutes.
                </p>
                <div className="auth-brand-features">
                    <div className="auth-brand-feature">
                        <i className="fa-solid fa-infinity"></i>
                        <span>Unlimited transactions</span>
                    </div>
                    <div className="auth-brand-feature">
                        <i className="fa-solid fa-chart-pie"></i>
                        <span>Category-wise analytics</span>
                    </div>
                    <div className="auth-brand-feature">
                        <i className="fa-solid fa-lock"></i>
                        <span>End-to-end encrypted data</span>
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
                            <i className="fa-solid fa-user-plus"></i>
                        </div>
                        <h2>Create account</h2>
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
                                name="username"
                                onChange={inputHandler}
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
                                name="email"
                                onChange={inputHandler}
                                autoComplete="off"
                                placeholder="Enter your email"
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
                                    placeholder="Create a password (min 8 chars)"
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
                            {user.password.length > 0 && (
                                <>
                                    <div className="password-strength">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`strength-segment ${pwdStrength >= i ? strengthClasses[pwdStrength] : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="strength-label">
                                        {strengthLabels[pwdStrength]} password
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm_password">
                                <i className="fa-solid fa-shield-halved"></i> Confirm Password
                            </label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm_password"
                                    name="confirm_password"
                                    onChange={inputHandler}
                                    autoComplete="off"
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading} id="register-submit-btn">
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Creating Account...</>
                            ) : (
                                <><i className="fa-solid fa-user-plus"></i> Create Account</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account?{" "}<Link to="/UserLogin">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
