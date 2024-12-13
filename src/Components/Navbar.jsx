import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css'; 
import profileIcon from '../photos/profileIcon.png';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
   
    useEffect(() => {
        // Check if there is a token that is still valid / logged 
        const token = localStorage.getItem("authToken");
        console.log("Token:", token); // Debug log
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        // For the logout 
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
        setProfileMenuVisible(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1 className='animated-logo'>Dinespot</h1>
            </div>
            <ul className="navbar-lists">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Restaurants">Restaurants</Link></li>
                <li><Link to="/AddRestaurant">Add Restaurant</Link></li>
            </ul>
            <ul className='navbar-auth'>
            {!isLoggedIn ? (
                <>
                    <li><Link to="/Login">Login</Link></li>
                    <li><Link to="/Register">Register</Link></li>
                </>
            ) : (
                <li className="profile-section">
                    <div 
                        className='profile-icon'
                        onClick={() => setProfileMenuVisible(!profileMenuVisible)}
                    >
                        <img 
                            src={profileIcon} 
                            alt="Profile" 
                            className="profile-image"
                        />
                    </div>
                    {profileMenuVisible && (
                        <div className="profile-menu">
                            <Link to="/profile">My Profile</Link>
                            <Link to="/bookings">My Bookings</Link>
                            <Link to="/settings">Settings</Link>
                            <Link to="/reviews">My Reviews</Link>
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
