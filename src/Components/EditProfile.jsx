import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phonenum: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!authToken || !userId) {
            navigate('/login');
            return;
        }

        fetch(`http://127.0.0.1:5005/user/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
            console.error('Error fetching user data:', err);
            setError('Failed to load user data. Please try logging in again.');
            setTimeout(() => navigate('/login'), 2000);
        });
    }, [navigate]);

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

        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!authToken || !userId) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5005/user/edit/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password || undefined,
                    phonenum: formData.phonenum ? parseInt(formData.phonenum, 10) : undefined
                })
            });

            const responseText = await response.text();
            console.log('Update response:', responseText);

            if (response.ok) {
                setMessage('Profile updated successfully!');
                localStorage.setItem('username', formData.username);
                localStorage.setItem('email', formData.email);
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(responseText || 'Failed to update profile');
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
            
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
