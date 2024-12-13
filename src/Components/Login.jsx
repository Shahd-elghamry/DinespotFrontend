import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const navigate = useNavigate();

    const loginUser = () => {
        fetch('http://127.0.0.1:5005/user/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Ensure the cookie is sent with the request
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }
                return response.json();
            })
            .then((data) => {
                alert(data.message);
                navigate("/"); // Navigate to home after login
            })
            .catch((error) => {
                setMessage(error.message);
                // alert(error.message);
            });
    };

    const handleForgotPassword = () => {
        fetch('http://127.0.0.1:5005/user/forgot-password', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: "include"
        })
        .then((response) => response.text())
        .then((data) => setMessage(data))  // Display the response message from backend
        .catch((error) => setMessage('An error occurred. Please try again.'));
    };

    return (
        <div className="login-form">
             <h1>{isForgotPassword ? "Forgot Password" : "Login"}</h1>

             {!isForgotPassword ? (
                // Login Form
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

