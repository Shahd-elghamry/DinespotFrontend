import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css'; 
import profileIcon from '../photos/profileIcon.png';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('');
   
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const storedUsername = localStorage.getItem("username");
        const storedUserType = localStorage.getItem("userType");
        
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                setUsername(storedUsername);
            }
            if (storedUserType) {
                setUserType(storedUserType);
            }
        }
    }, []);

    const handleLogout = () => {
        //for the logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setIsLoggedIn(false);
        setProfileMenuVisible(false);
        window.location.reload();
    };

    const canAddRestaurant = userType === 'restaurant_owner' || userType === 'admin';

    const renderProfileMenuItems = () => {
        const commonItems = (
            <>
                <Link to="/profile">My Profile</Link>
                <Link to="/settings">Settings</Link>
            </>
        );

        let roleSpecificItems = null;

        switch(userType) {
            case 'regular_user':
                roleSpecificItems = (
                    <Link to="/bookings">My Bookings</Link>
                );
                break;
            case 'restaurant_owner':
                roleSpecificItems = (
                    <Link to="/my-restaurants">My Restaurants</Link>
                );
                break;
            case 'admin':
                roleSpecificItems = (
                    <Link to="/control-panel">Control Panel</Link>
                );
                break;
            default:
                break;
        }

        return (
            <>
                {commonItems}
                {roleSpecificItems}
                <button onClick={handleLogout}>Logout</button>
            </>
        );
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1 className='animated-logo'>Dinespot</h1>
            </div>
            <ul className="navbar-lists">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/restaurant">Restaurants</Link></li>
                {canAddRestaurant && (
                    <li><Link to="/AddRestaurant">Add Restaurant</Link></li>
                )}
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
                        <span className="username">{username}</span>
                    </div>
                    {profileMenuVisible && (
                        <div className="profile-menu">
                            {renderProfileMenuItems()}
                        </div>
                    )}
                </li>
            )}
            </ul>
        </nav>
    );
};

export default Navbar;
