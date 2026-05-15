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
        <div className="card animate-in" style={{ padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <div className="category-icon" style={{ backgroundColor: config.bg, color: config.text }}>
                    <i className={`fa-solid ${icon || config.icon}`}></i>
                </div>
                {trend && (
                    <span className={`badge ${trend > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            
            <span className="form-label" style={{ marginBottom: '4px', fontSize: '0.65rem' }}>{title}</span>
            
            <h2 style={{ 
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', 
                margin: 0, 
                fontWeight: 800,
                color: 'var(--color-text)'
            }}>
                ₹{Number(amount || 0).toLocaleString('en-IN')}
            </h2>
            
            {subtitle && (
                <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--color-text-muted)',
                    display: 'block',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {subtitle}
                </span>
            )}
        </div>
    );
}

export default SummaryCard;