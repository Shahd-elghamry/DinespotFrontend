import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
        // Add dark mode implementation here
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            
            <div className="settings-section">
                <h3>Theme</h3>
                <div className="setting-item">
                    <label>
                        Dark Mode
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={handleDarkModeToggle}
                        />
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Account</h3>
                <div className="setting-item">
                    <button onClick={() => navigate('/edit-profile')}>
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
