/*
 * SummaryCard Component — Redesigned
 * Changes: Rich aesthetics, Inter typography, 
 * dynamic icons, metric badges, and responsive scaling.
 */
import React from 'react';

function SummaryCard({ title, amount, subtitle, color, icon, trend }) {
    // Mapping colors to the design system tokens
    const colorClasses = {
        success: {
            bg: "var(--color-success-bg)",
            text: "var(--color-success)",
            icon: "fa-arrow-trend-up"
        },
        danger: {
            bg: "var(--color-danger-bg)",
            text: "var(--color-danger)",
            icon: "fa-arrow-trend-down"
        },
        warning: {
            bg: "var(--color-warning-bg)",
            text: "var(--color-warning)",
            icon: "fa-clock"
        },
        primary: {
            bg: "rgba(108, 99, 255, 0.15)",
            text: "var(--color-primary)",
            icon: "fa-wallet"
        }
    };

    const config = colorClasses[color] || colorClasses.primary;

    return (
        <div className="card summary-card animate-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="category-icon" style={{ backgroundColor: config.bg, color: config.text }}>
                    <i className={`fa-solid ${icon || config.icon}`}></i>
                </div>
                {trend && (
                    <span className={`badge ${trend > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
                    </span>
                )}
            </div>
            
            <div style={{ marginTop: 'auto' }}>
                <span className="form-label" style={{ marginBottom: '4px', fontSize: '0.7rem', display: 'block' }}>{title}</span>
                <h2 style={{ 
                    fontSize: 'clamp(1.1rem, 5vw, 1.5rem)', 
                    margin: 0, 
                    fontWeight: 800,
                    color: 'var(--color-text)',
                    lineHeight: 1
                }}>
                    ₹{Number(amount || 0).toLocaleString('en-IN')}
                </h2>
                
                {subtitle && (
                    <span style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--color-text-muted)',
                        display: 'block',
                        marginTop: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        opacity: 0.8
                    }}>
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
}

export default SummaryCard;