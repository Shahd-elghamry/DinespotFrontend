import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../AuthContext.js';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

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
            console.log('Login response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Extract user ID from token
            const tokenParts = data.token.split('.');
            let userId = '';
            try {
                const tokenPayload = JSON.parse(atob(tokenParts[1]));
                userId = tokenPayload.id;
                console.log('Extracted user ID from token:', userId);
            } catch (err) {
                console.error('Error extracting user ID from token:', err);
            }

            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userType', data.userType);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            localStorage.setItem('userId', userId);

            console.log('Stored auth data:', {
                token: !!localStorage.getItem('authToken'),
                userType: localStorage.getItem('userType'),
                email: localStorage.getItem('email'),
                username: localStorage.getItem('username'),
                userId: localStorage.getItem('userId')
            });

            // Call login from context
            await login(data.token, data.userType, {
                username: data.username,
                email: data.email,
                id: userId
            });
            
            setMessage('Login successful!');
            setTimeout(() => {
                navigate('/');
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
