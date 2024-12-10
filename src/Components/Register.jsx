import React, { useState } from "react";

const RegistrationForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user_type, setUserType] = useState("regular");  
    const [phonenum, setPhonenum] = useState(" ")
    const [message, setMessage] = useState("");

    const registerUser = () => {
        fetch('http://127.0.0.1:5005/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, user_type, phonenum }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                setMessage("Registration successful");
                alert("Registration successful");
            })
            .catch((error) => {
                setMessage(error.message);
                alert(error.message);
            })
    }
    return (
        <div>
            <h1>Registration Form</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); 
                    registerUser();
                }}
            >
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
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
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={phonenum}
                    onChange={(e) => setPhonenum(e.target.value)}
                />
                <br />
                <label>user type</label>
                <input
                    type="checkbox"
                    checked={user_type}
                    onChange={(e) => setUserType(e.target.checked)}
                />
                <br />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegistrationForm;
