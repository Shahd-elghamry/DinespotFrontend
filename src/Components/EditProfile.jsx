import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phonenum: ''
    });

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
            alert('Failed to load user data. Please try logging in again.');
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
                alert('Profile updated successfully!');
                localStorage.setItem('username', formData.username);
                localStorage.setItem('email', formData.email);
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                alert(responseText || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(err.message || 'Failed to update profile');
        }
    };

    return (
        <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <button type="button" onClick={() => navigate('/')} className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h2>Edit Profile</h2>

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
                        type="tel"
                        name="phonenum"
                        value={formData.phonenum}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
