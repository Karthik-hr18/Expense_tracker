import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="home-nav">
        <div className="nav-logo">
          <span className="logo-icon">💰</span>
          <h1>ExpenseTracker</h1>
        </div>
        <div className="nav-buttons">
          <Link to="/UserLogin" className="btn btn-login">Log In</Link>
          <Link to="/UserRegister" className="btn btn-signup">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Take Control of Your Finances</h2>
          <p className="hero-subtitle">
            Track your spending, analyze your habits, and achieve your financial goals with our intuitive and powerful expense tracking platform.
          </p>
          <div className="hero-actions">
            <Link to="/UserRegister" className="btn btn-cta">Get Started for Free</Link>
            <Link to="/UserLogin" className="btn btn-secondary">I already have an account</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card mockup-card">
            <div className="mockup-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-balance">
                <p>Total Balance</p>
                <h3>$4,520.50</h3>
              </div>
              <div className="mockup-chart">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
                <div className="bar bar-4"></div>
                <div className="bar bar-5"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h3 className="section-title">Why Choose ExpenseTracker?</h3>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">📊</div>
            <h4>Visual Analytics</h4>
            <p>Get clear insights into your spending patterns with beautiful, easy-to-understand charts and graphs.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">💸</div>
            <h4>Easy Tracking</h4>
            <p>Log your daily expenses and incomes in seconds. Categorize transactions to see where your money goes.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure & Private</h4>
            <p>Your financial data is encrypted and secure. We prioritize your privacy and data protection above all.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
