import React from 'react';
import './Settings.css';

const Settings = () => {
    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <div className="settings-section">
                <h3>Preferences</h3>
                {/* Add your settings options here */}
                <div className="setting-item">
                    <label>Notifications</label>
                    <input type="checkbox" />
                </div>
                <div className="setting-item">
                    <label>Dark Mode</label>
                    <input type="checkbox" />
                </div>
            </div>
        </div>
    );
};

export default Settings;
