"use client"
import React, { useState } from 'react';
import { Sparkles, Chrome } from 'lucide-react';
import "./style.css"
export default function Page() {
    const [isLogin, setIsLogin] = useState(true);

  const handleGoogleAuth = () => {
  window.location.href = "/api/auth/google/redirect/";
};


    return (
        <div className="auth-container">
            {/* Left Side - Branding */}
            <div className="auth-branding">
                <div className="auth-branding-content">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">
                            <Sparkles size={48} />
                        </div>
                        <h1 className="auth-logo-text">HSGPT</h1>
                    </div>

                    <div className="auth-tagline">
                        <h2 className="auth-tagline-title">
                            Your Intelligent AI Assistant
                        </h2>
                        <p className="auth-tagline-description">
                            Experience the power of advanced AI conversations. Get instant answers, creative ideas, and expert assistance at your fingertips.
                        </p>
                    </div>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <div className="auth-feature-icon">✨</div>
                            <div className="auth-feature-text">
                                <h3>Smart Conversations</h3>
                                <p>Engage in natural, context-aware dialogues</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-icon">⚡</div>
                            <div className="auth-feature-text">
                                <h3>Lightning Fast</h3>
                                <p>Get instant responses to your queries</p>
                            </div>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-icon">🔒</div>
                            <div className="auth-feature-text">
                                <h3>Secure & Private</h3>
                                <p>Your conversations stay confidential</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-footer">
                    <p>&copy; 2024 HSGPT. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Authentication Form */}
            <div className="auth-form-section">
                <div className="auth-form-container">
                    {/* Toggle Pills */}
                    <div className="auth-toggle">
                        <button
                            className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="auth-form-content">
                        <div className="auth-form-header">
                            <h2 className="auth-form-title">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="auth-form-subtitle">
                                {isLogin
                                    ? 'Sign in to continue your AI journey'
                                    : 'Start your AI-powered conversations today'
                                }
                            </p>
                        </div>

                        {/* Google Sign In Button */}
                        <button className="google-auth-btn" onClick={handleGoogleAuth}>
                            <div className="google-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <span className="google-auth-text">
                                {isLogin ? 'Continue with Google' : 'Sign up with Google'}
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="auth-divider">
                            <span className="auth-divider-text">or</span>
                        </div>

                        {/* Coming Soon Message */}
                        <div className="auth-coming-soon">
                            <div className="coming-soon-badge">Coming Soon</div>
                            <p className="coming-soon-text">
                                Email & password authentication will be available soon. For now, please use Google Sign-In.
                            </p>
                        </div>

                        {/* Terms & Privacy */}
                        <div className="auth-terms">
                            <p>
                                By continuing, you agree to HSGPT's{' '}
                                <a href="#" className="auth-link">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="auth-link">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Branding Footer */}
                <div className="auth-mobile-footer">
                    <div className="auth-mobile-logo">
                        <Sparkles size={20} />
                        <span>HSGPT</span>
                    </div>
                    <p>&copy; 2024 HSGPT</p>
                </div>
            </div>
        </div>
    );
}

