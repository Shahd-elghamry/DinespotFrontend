import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import './MyRestaurants.css';

const MyRestaurants = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [bookings, setBookings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchMyRestaurants();
    }, []);

    useEffect(() => {
        if (selectedRestaurant) {
            fetchRestaurantBookings(selectedRestaurant.id);
        }
    }, [selectedRestaurant]);

    const fetchMyRestaurants = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${BASE_URL}/restaurant/owner`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch restaurants');
            }

            const data = await response.json();
            setRestaurants(data.restaurants || []); // Ensure we're accessing the correct property
            if (data.restaurants && data.restaurants.length > 0) {
                setSelectedRestaurant(data.restaurants[0]);
            }
            setError('');
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message || 'Error fetching your restaurants. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRestaurantBookings = async (restaurantId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/booking/restaurant/${restaurantId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch bookings');
            }

            const data = await response.json();
            setBookings(prev => ({
                ...prev,
                [restaurantId]: data.bookings || [] // Ensure we're accessing the correct property
            }));
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Error fetching bookings. Please try again later.');
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/booking/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${newStatus} booking`);
            }

            setSuccessMessage(`Booking ${newStatus} successfully`);
            setTimeout(() => setSuccessMessage(''), 3000);

            // Refresh bookings for the current restaurant
            if (selectedRestaurant) {
                fetchRestaurantBookings(selectedRestaurant.id);
            }
        } catch (err) {
            setError(err.message || 'Error updating booking status');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="loading">Loading your restaurants...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (restaurants.length === 0) return <div className="no-restaurants">You haven't added any restaurants yet.</div>;

    return (
        <div className="my-restaurants-container">
            <h1>My Restaurants</h1>
            
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="restaurant-selector">
                <label htmlFor="restaurant-select">Select Restaurant:</label>
                <select
                    id="restaurant-select"
                    value={selectedRestaurant?.id || ''}
                    onChange={(e) => {
                        const restaurant = restaurants.find(r => r.id === parseInt(e.target.value));
                        setSelectedRestaurant(restaurant);
                    }}
                >
                    {restaurants.map(restaurant => (
                        <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedRestaurant && (
                <div className="restaurant-details">
                    <h2>{selectedRestaurant.name}</h2>
                    <div className="restaurant-info">
                        <p><strong>Location:</strong> {selectedRestaurant.location}</p>
                        <p><strong>Cuisine:</strong> {selectedRestaurant.cuisine}</p>
                        <p><strong>Maximum Capacity:</strong> {selectedRestaurant.maxcapacity}</p>
                        <p><strong>Available Capacity:</strong> {selectedRestaurant.availablecapacity}</p>
                    </div>

                    <div className="bookings-section">
                        <h3>Bookings</h3>
                        {bookings[selectedRestaurant.id]?.length > 0 ? (
                            <div className="bookings-grid">
                                <div className="booking-header">
                                    <span>Date</span>
                                    <span>Time</span>
                                    <span>Customer</span>
                                    <span>Party Size</span>
                                    <span>Status</span>
                                    <span>Actions</span>
                                </div>
                                {bookings[selectedRestaurant.id].map(booking => (
                                    <div key={booking.id} className={`booking-row ${booking.status.toLowerCase()}`}>
                                        <span>{formatDate(booking.booking_date)}</span>
                                        <span>{booking.booking_time}</span>
                                        <span>{booking.user_name}</span>
                                        <span>{booking.quantity}</span>
                                        <span className={`status ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                        <span className="booking-actions">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button 
                                                        className="accept-btn"
                                                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        className="decline-btn"
                                                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-bookings">No bookings found for this restaurant.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRestaurants;
