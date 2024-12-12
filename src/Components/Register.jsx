import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRestaurant from "./AddResturant";
import appleIcon from "../photos/apple-icon.png";
import './Register.css';

const RegistrationForm = () => {
    const [step, setStep] = useState(1) // Once the page loads to the user step 1 happens.
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user_type, setUserType] = useState("");  
    const [phonenum, setPhonenum] = useState(" ")
    const [message, setMessage] = useState("");
    const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

    const navigate = useNavigate();

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
                if (user_type === "owner") {
                    setRegistrationSuccessful(true); 
                } else {
                    navigate("/"); 
                }
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
                className="userType-button"
                onClick={()=> handleSelectUserType("owner")}>
                    Restaurant Owner
                </button>
            </div>
            )}
            {step === 2 && !registrationSuccessful && ( 
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
            <div className="registration-icons">
                        <img
                            src={appleIcon}
                            alt="Register with Apple"
                            className="registration-icon"
                        />
                    </div>
            {message && <p>{message}</p>}
        </div>
            )}
            {registrationSuccessful && <AddRestaurant />}
        </div>
    );
};

export default RegistrationForm;
