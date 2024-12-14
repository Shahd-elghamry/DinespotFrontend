import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './EditProfile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phonenum: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('EditProfile mounted, isAuthenticated:', isAuthenticated);
        
        // Check authentication first
        if (!isAuthenticated) {
            console.log('Not authenticated, redirecting to login');
            navigate('/login');
            return;
        }

        const userId = localStorage.getItem('userId');
        const authToken = localStorage.getItem('authToken');
        
        console.log('userId:', userId);
        console.log('authToken exists:', !!authToken);

        if (!userId || !authToken) {
            setError('Unable to load user data');
            return;
        }

        // Fetch user data
        fetch(`http://127.0.0.1:5005/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            console.log('User data:', data);
            setFormData({
                username: data.username || '',
                email: data.email || '',
                password: '',
                phonenum: data.phonenum ? data.phonenum.toString() : ''
            });
        })
        .catch(err => {
            console.error('Error:', err);
            setError('Error loading user data: ' + err.message);
        });
    }, [navigate, isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const userId = localStorage.getItem('userId');
        const authToken = localStorage.getItem('authToken');

        if (!userId || !authToken) {
            setError('You must be logged in to update your profile');
            return;
        }

        // Only include fields that have been changed
        const updates = {};
        if (formData.username) updates.username = formData.username;
        if (formData.email) updates.email = formData.email;
        if (formData.password) updates.password = formData.password;
        if (formData.phonenum) updates.phonenum = parseInt(formData.phonenum, 10) || null;

        try {
            const response = await fetch(`http://127.0.0.1:5005/user/edit/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.text();
            console.log('Update response:', data);

            if (response.ok) {
                setMessage('Profile updated successfully!');
                // Update local storage
                if (updates.username) localStorage.setItem('username', updates.username);
                if (updates.email) localStorage.setItem('email', updates.email);
                
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 1500);
            } else {
                setError(data || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phonenum"
                        value={formData.phonenum}
                        onChange={handleChange}
                        placeholder="Enter 10-digit phone number"
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
