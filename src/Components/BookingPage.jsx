import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        quantity: '1',
        special_requests: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch restaurant details to get the name
        fetch(`http://127.0.0.1:5005/resturant/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Restaurant data:', data);
                setRestaurant(data);
                // Set the restaurant name in the form data
                setFormData(prev => ({
                    ...prev,
                    name: data.name // This is the restaurant name from the database
                }));
            })
            .catch(err => {
                console.error('Error fetching restaurant:', err);
                setError('Error loading restaurant details');
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Ensure we have the restaurant name
            if (!formData.name) {
                setError('Restaurant name is missing');
                return;
            }

            const bookingData = {
                name: formData.name, // This is the restaurant name
                date: formData.date,
                time: formData.time,
                quantity: parseInt(formData.quantity, 10),
                special_requests: formData.special_requests || ''
            };

            console.log('Sending booking data:', bookingData);

            const response = await fetch('http://127.0.0.1:5005/resturant/book', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            console.log('Response status:', response.status);
            const data = await response.text();
            console.log('Response data:', data);

            if (response.ok) {
                alert('Booking successful!');
                navigate(`/restaurant/${id}`);
            } else {
                setError(data || 'Failed to book. Please try again.');
                console.error('Booking failed:', data);
            }
        } catch (error) {
            console.error('Booking error:', error);
            setError('Error submitting booking. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Form field updated:', name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!restaurant) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="booking-container">
            <h1>Make a Reservation at {restaurant.name}</h1>
            <form onSubmit={handleSubmit} className="booking-form">
                <button 
                    type="button"
                    className="back-button"
                    onClick={() => navigate(`/restaurant/${id}`)}
                >
                    ↩
                </button>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Number of Guests:</label>
                    <select
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="special_requests">Special Requests:</label>
                    <textarea
                        id="special_requests"
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <button type="submit" className="submit-button">Book Now</button>
            </form>
        </div>
    );
};

export default BookingPage;
