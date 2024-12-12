import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

import './Navbar.css'; 

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
   
    useEffect(() => {
        // Check if there is a token that is still valid / logged 
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        // For the logout 
        setIsLoggedIn(false);
        localStorage.removeItem("userToken"); 
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1 className='animated-logo'>Dinespot</h1>
            </div>
            <ul className="navbar-lists">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Restaurants">Restaurants</Link></li>
            </ul>
            <ul className='navbar-auth'>
            {/* conditional (ternary) operator {!something ?(...):(...)} */}
            {!isLoggedIn ? (
                    <>
                <li><Link to="/Login">Login</Link></li>
                <li><Link to="/Register">Register</Link></li>
                </>
            ) : (
                <li className="profile-icon" onClick={() => setProfileMenuVisible(!profileMenuVisible)}>
                <img src="./photos/profileIcon.png" alt="Profile" className="profile-img" />
                {profileMenuVisible && (
                    <div className="profile-menu">
                        <Link to="/Profile">View Profile</Link>
                        <Link to="/Bookings">My Bookings</Link>
                        <Link to="/Reviews">My Reviews</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
                </li>
            )}
            </ul>
        </nav>
    );
};

export default Navbar;


