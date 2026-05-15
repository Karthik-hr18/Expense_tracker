/*
 * Home Component — Redesigned
 * Changes: Premium SaaS landing page, glassmorphism visual,
 * and high-conversion CTA structure.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-logo">
          <i className="fa-solid fa-chart-pie"></i>
          <span>ExpenseTracker</span>
        </div>
        <div className="nav-buttons">
          <Link to="/UserLogin" className="btn btn-ghost">Log In</Link>
          <Link to="/UserRegister" className="btn btn-primary">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Master your money with confidence.</h1>
        <p className="hero-subtitle">
          Track every rupee, analyze your habits, and reach your financial goals faster with our beautiful, intuitive expense tracker.
        </p>
        <div className="hero-actions">
          <Link to="/UserRegister" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Today — It's Free
          </Link>
          <Link to="/UserLogin" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
            View Demo
          </Link>
        </div>

        {/* Visual Mockup */}
        <div className="hero-visual">
          <div className="glass-mockup">
            <div className="mockup-grid">
              <div className="mockup-card">
                <span className="mockup-label">Total Balance</span>
                <h2 className="mockup-value">₹4,52,000</h2>
              </div>
              <div className="mockup-card">
                <span className="mockup-label">Monthly Spend</span>
                <h2 className="mockup-value" style={{ color: 'var(--color-danger)' }}>₹12,400</h2>
              </div>
            </div>
            <div className="mockup-chart">
              <div className="chart-bar" style={{ height: '40%', opacity: 0.3 }}></div>
              <div className="chart-bar" style={{ height: '60%', opacity: 0.5 }}></div>
              <div className="chart-bar" style={{ height: '30%', opacity: 0.3 }}></div>
              <div className="chart-bar" style={{ height: '80%' }}></div>
              <div className="chart-bar" style={{ height: '50%', opacity: 0.6 }}></div>
              <div className="chart-bar" style={{ height: '70%', opacity: 0.8 }}></div>
              <div className="chart-bar" style={{ height: '45%', opacity: 0.4 }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div style={{ textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Features</span>
          <h2 style={{ fontSize: '2.5rem' }}>Everything you need to succeed</h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-bolt"></i></div>
            <h3>Fast Tracking</h3>
            <p>Log transactions in under 5 seconds. Categorize with a tap using our smart suggestions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-chart-line"></i></div>
            <h3>Smart Analytics</h3>
            <p>Get deep insights into where your money goes with beautiful charts and trend analysis.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h3>Bank-Grade Security</h3>
            <p>Your data is yours. We use end-to-end encryption to keep your financial life private.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'var(--space-3xl) var(--space-lg)', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} ExpenseTracker. Built for financial freedom.
        </p>
      </footer>
    </div>
  );
};

export default Home;
