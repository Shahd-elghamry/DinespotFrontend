import React, { useState } from "react";

const RegistrationForm = () => {
    const [step, setStep] = useState(1) // Once the page loads to the user step 1 happens.
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user_type, setUserType] = useState("");  
    const [phonenum, setPhonenum] = useState(" ")
    const [message, setMessage] = useState("");

    const handleSelectUserType = (type)=>{
        setUserType(type);
        setStep(2);
    }
    
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
    };
    return (
        <div className="registration-div">
            {step === 1 && (
            <div className="select-user-type">
                <h1>Choose User Type</h1>
                <button 
                className="userType-button"
                onClick={()=>handleSelectUserType("regular")} >
                    Normal User
                </button>
                <button
                className="user-type-button"
                onClick={()=> handleSelectUserType("owner")}>
                    Restaurant Owner
                </button>
            </div>
            )}
            {step === 2 && ( 
                <div className="registration-form">
            <h1>Registration Form</h1>
            <p> 
                Registering as:{" "}
                <strong>{user_type === "regular" ? "Normal User": "Restaurant Owner"}</strong>
                </p>
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
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
            )}
        </div>
    );
};

export default RegistrationForm;
