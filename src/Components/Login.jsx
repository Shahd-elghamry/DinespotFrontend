import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import Cookies from "js-cookie";
import { jwtDecode }  from "jwt-decode";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    
    const navigate = useNavigate();

    const loginUser = () => {
        fetch('http://127.0.0.1:5005/user/login', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }
                return response.json();
            }).then((data)=>{
                
                alert(data)
                const token = Cookies.get('auth'); 
                if (!token){
                    return alert("No token found")
                }
                const decode = jwtDecode(token)
                alert(`Welcome, ${decode.username}`);
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
