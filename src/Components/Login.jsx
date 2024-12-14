import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch('http://127.0.0.1:5005/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            console.log('Login response:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Check if we have all required data
            if (!data.token || !data.username || !data.userType) {
                throw new Error('Invalid response from server');
            }

            // Store user data in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email || '');
            localStorage.setItem('userType', data.userType);
            
            // Only set userId if it exists
            if (data.id !== undefined && data.id !== null) {
                localStorage.setItem('userId', data.id.toString());
            }

            setMessage('Login successful!');
            
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Login error:', err);
            setMessage(err.message || 'Failed to login. Please try again.');
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
                        <FontAwesomeIcon icon={faApple} className="provider-icon" />
                        Continue with Apple
                    </button>
                    
                    <button type="button" className="continue-with-button google">
                        <FontAwesomeIcon icon={faGoogle} className="provider-icon" />
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
