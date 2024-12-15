import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.js';
import './MyBookings.css';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../config';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [isAuthenticated, navigate]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId'); 
            if (!token || !userId) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${BASE_URL}/booking/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setBookings([]); 
                    return;
                }
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            
            const bookingsWithRestaurantNames = await Promise.all(data.map(async booking => {
                try {
                    const restaurantResponse = await fetch(`${BASE_URL}/resturant/${booking.restaurant_id}`);
                    if (restaurantResponse.ok) {
                        const restaurantData = await restaurantResponse.json();
                        return {
                            ...booking,
                            restaurant_name: restaurantData.name
                        };
                    }
                    return {
                        ...booking,
                        restaurant_name: 'Unknown Restaurant'
                    };
                } catch (error) {
                    console.error('Error fetching restaurant details:', error);
                    return {
                        ...booking,
                        restaurant_name: 'Unknown Restaurant'
                    };
                }
            }));

            setBookings(bookingsWithRestaurantNames);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/booking/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'cancelled'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            setBookings(bookings.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'cancelled' }
                    : booking
            ));
        } catch (error) {
            setError(error.message);
            console.error('Error cancelling booking:', error);
        }
    };

    const handleUpdateBooking = async (bookingId, updatedData) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/booking/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    booking_date: updatedData.date,
                    booking_time: updatedData.time,
                    quantity: updatedData.quantity,
                    special_requests: updatedData.special_requests
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update booking');
            }

            await fetchBookings();
            setEditingBooking(null);
        } catch (error) {
            setError(error.message);
            console.error('Error updating booking:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="bookings-container loading">Loading...</div>;
    }

    if (error) {
        return <div className="bookings-container error">Error: {error}</div>;
    }

    return (
        <div className="bookings-container">
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map(booking => (
                        <div key={booking.id} className={`booking-card ${booking.status.toLowerCase()}`}>
                            <div className="booking-header">
                                <h2>{booking.restaurant_name}</h2>
                                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="booking-details">
                                <p><strong>Date:</strong> {formatDate(booking.booking_date)}</p>
                                <p><strong>Time:</strong> {booking.booking_time}</p>
                                <p><strong>Party Size:</strong> {booking.quantity} people</p>
                                {booking.special_requests && (
                                    <p><strong>Special Requests:</strong> {booking.special_requests}</p>
                                )}
                            </div>
                            {booking.status === 'pending' && (
                                <div className="booking-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => setEditingBooking(booking)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        <FaTrash /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {editingBooking && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h2>Edit Booking</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateBooking(editingBooking.id, {
                                date: e.target.date.value,
                                time: e.target.time.value,
                                quantity: parseInt(e.target.quantity.value),
                                special_requests: e.target.special_requests.value
                            });
                        }}>
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    defaultValue={editingBooking.booking_date}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time:</label>
                                <input
                                    type="time"
                                    name="time"
                                    defaultValue={editingBooking.booking_time}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Party Size:</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    defaultValue={editingBooking.quantity}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Special Requests:</label>
                                <textarea
                                    name="special_requests"
                                    defaultValue={editingBooking.special_requests}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    <FaCheck /> Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setEditingBooking(null)}
                                >
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
