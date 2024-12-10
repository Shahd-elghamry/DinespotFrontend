import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

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

                // Since the token is set as an HTTP-only cookie, we won't be able to access it with js-cookie.
                // You should rely on server-side validation for this token
                navigate("/"); // Navigate to home after login
            })
            .catch((error) => {
                setMessage(error.message);
                // alert(error.message);
            });
    };

    return (
        <div className="login-form">
            <h1>Login</h1>
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
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
};

export default LoginForm;

