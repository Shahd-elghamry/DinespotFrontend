import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../AuthContext';
import './Navbar.css'; 
import profileIcon from '../photos/profileIcon.png';

const Navbar = () => {
    const { isAuthenticated, logout, userType, setUserType } = useContext(AuthContext);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
    const [username, setUsername] = useState('');
   
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        
        if (isAuthenticated) {
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        setUserType(null);
        setProfileMenuVisible(false);
        window.location.reload();
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://127.0.0.1:5005/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete account');
            }

            // Clear all local storage items
            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.message || 'An error occurred while deleting account');
        }
    };

    const canAddRestaurant = userType === 'restaurant_owner' || userType === 'admin';

    const renderProfileMenuItems = () => {
        if (!userType) return null;

        const commonItems = (
            <>
                <Link to="/profile">My Profile</Link>
                <Link to="/edit-profile" className="nav-link">Edit Profile</Link>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
                <button onClick={handleLogout}>Logout</button>
            </>
        );

        switch(userType) {
            case 'regular_user':
                return (
                    <>
                        {commonItems}
                        <Link to="/bookings">My Bookings</Link>
                    </>
                );
            case 'restaurant_owner':
                return (
                    <>
                        {commonItems}
                        <Link to="/my-restaurants">My Restaurants</Link>
                    </>
                );
            case 'admin':
                return (
                    <>
                        {commonItems}
                        <Link to="/control-panel">Control Panel</Link>
                    </>
                );
            default:
                return commonItems;
        }
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
                <li>
                    <Link to="/settings" className="nav-link">Settings</Link>
                </li>
            </ul>
            <ul className='navbar-auth'>
                {!isAuthenticated ? (
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
