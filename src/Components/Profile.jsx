import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './ProfileStyle.css';
import { BASE_URL } from '../config';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Fetching profile with token:', token);
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        console.log('Profile response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User profile not found');
          }
          if (response.status === 401) {
            throw new Error('Unauthorized - please log in again');
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('Profile data received:', data);
        setUserData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
        if (error.message.includes('Unauthorized')) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate, isAuthenticated]);

  if (error) {
    return <div className="profile-container">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="profile-container">Loading...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={userData.avatar || 'https://via.placeholder.com/150'} alt="Profile" />
        </div>
        <h1>{userData.name}</h1>
        <span className="user-type">{userData.userType}</span>
      </div>

      <div className="profile-sections">
        <section className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <span>{userData.email}</span>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <span>{userData.phone || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Account Status</label>
              <span className="status active">Active</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>Account Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Member Since</label>
              <span>{formatDate(userData.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Last Login</label>
              <span>{formatDate(userData.lastLogin)}</span>
            </div>
          </div>
        </section>

        {userData.userType === 'restaurant_owner' && (
          <section className="profile-section">
            <h2>Restaurant Management</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Restaurants Owned</label>
                <span>{userData.restaurantsCount || 0}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;
