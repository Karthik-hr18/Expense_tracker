/*
 * Coming Soon Component
 * A premium, interactive, and modern "Coming Soon" landing card
 * for yet-to-be-released features (like Forgot Password recovery).
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ComingSoon.css";

const ComingSoon = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleNotify = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setIsSubmitted(true);
        toast.success("Awesome! We'll notify you as soon as this feature launches.", {
            icon: "🚀",
            duration: 4000,
        });
        setEmail("");
    };

    return (
        <div className="coming-soon-container">
            {/* Background glowing mesh blobs */}
            <div className="bg-glow blob-1"></div>
            <div className="bg-glow blob-2"></div>

            <div className="coming-soon-card animate-in">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="btn-back">
                    <i className="fa-solid fa-arrow-left"></i> Go Back
                </button>
                <div style={{ color: "rgba(170, 165, 165, 1)", fontSize: "25px", fontFamily: "Poppins", fontWeight: "bold", textAlign: "center", justifyContent: "center" }}>
                    <span className="mt-2">Nahhhh Man Why........?</span>
                </div>
                <div className="cs-header">
                    <div className="cs-icon-wrap">
                        <i className="fa-solid fa-rocket fa-bounce"></i>
                    </div>
                    <span className="cs-badge">Under Construction</span>
                    <h1>Exciting Feature Coming Soon!</h1>
                    <p className="cs-subtitle">
                        We're currently crafting a secure, seamless, and premium experience for this module.
                        It will be available in the next major update!
                    </p>
                </div>

                {/* Progress bar or feature illustration */}
                <div className="cs-progress-container">
                    <div className="cs-progress-info">
                        <span>Development Progress</span>
                        <span>85% Completed</span>
                    </div>
                    <div className="cs-progress-bar">
                        <div className="cs-progress-fill" style={{ width: "85%" }}></div>
                    </div>
                </div>

                {/* Interactive Subscription Form */}
                <form className="cs-notify-form" onSubmit={handleNotify}>
                    <h3>Want to be notified when it's live?</h3>
                    <p>Enter your email and stay in the loop with our latest releases.</p>
                    <div className="cs-input-group">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitted}
                            required
                        />
                        <button type="submit" className="btn-cs-submit" disabled={isSubmitted}>
                            {isSubmitted ? (
                                <><i className="fa-solid fa-check"></i> Subscribed</>
                            ) : (
                                "Notify Me"
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer brand info */}
                <div className="cs-footer">
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>ExpenseTracker Core Dev Team</span>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
