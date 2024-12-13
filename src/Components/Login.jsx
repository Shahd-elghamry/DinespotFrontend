import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const navigate = useNavigate();

    const loginUser = async () => {
        try {
            console.log('Attempting login with:', { email }); // Debug log

            const response = await fetch('http://127.0.0.1:5005/user/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const data = await response.json();
            console.log('Login response:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.token) {
                // Store the token and user info in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userType', data.userType);
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                
                console.log('Stored in localStorage:', {
                    token: data.token,
                    userType: data.userType,
                    username: data.username,
                    email: data.email
                }); // Debug log

                // Navigate to home first
                navigate("/");
                
                // Then reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            console.error('Login error:', error); // Debug log
            setMessage(error.message);
        }
    };

    const handleForgotPassword = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5005/user/forgot-password', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: "include"
            });
            const data = await response.text();
            setMessage(data);
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        handleForgotPassword();
    };

    return (
        <div className="login-div">
            {isForgotPassword ? (
                <form className="login-form" onSubmit={handleForgotPasswordSubmit}>
                    <h1>Forgot Password</h1>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Reset Password</button>
                    <br />
                    <button type="button" onClick={() => setIsForgotPassword(false)}>
                        Back to Login
                    </button>
                </form>
            ) : (
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Login</button>
                    
                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="continue-with-button apple">
                        <img src="/images/appleIcon.png" alt="Apple" className="provider-icon" />
                        Continue with Apple
                    </button>
                    
                    <button type="button" className="continue-with-button google">
                        <img src="/images/googleIcon.png" alt="Google" className="provider-icon" />
                        Continue with Google
                    </button>

                    <div className="create-account">
                        <span>Don't have an account?</span>
                        <button type="button" className="create-account-button" onClick={() => navigate('/register')}>
                            Create Account
                        </button>
                    </div>
                    <br />
                    <button type="button" className="forgot-password-link" onClick={() => setIsForgotPassword(true)}>
                        Forgot Password?
                    </button>
                </form>
            )}
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
};

export default LoginForm;
