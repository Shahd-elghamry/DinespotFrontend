import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

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

    return (
        <div className="login-form">
            <h1>{isForgotPassword ? "Forgot Password" : "Login"}</h1>

            {!isForgotPassword ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loginUser();
                    }}
                >
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Login</button>
                    <br />
                    <a href="#" onClick={() => setIsForgotPassword(true)}>Forgot Password?</a>
                </form>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleForgotPassword();
                    }}
                >
                    <label>Enter your email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Submit</button>
                    <br />
                    <a href="#" onClick={() => setIsForgotPassword(false)}>Back to Login</a>
                </form>
            )}
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
};

export default LoginForm;
