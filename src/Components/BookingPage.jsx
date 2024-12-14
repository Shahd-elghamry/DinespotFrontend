import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '1',
        specialRequests: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5005/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    restaurant_id: id,
                    ...formData
                }),
            });

            if (response.ok) {
                alert('Booking successful!');
                navigate(`/restaurant/${id}`);
            } else {
                const data = await response.json();
                alert(data.message || 'Booking failed. Please try again.');
            }
        } catch (error) {
            alert('Error submitting booking. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="booking-container">
            <h1>Make a Reservation</h1>
            <form onSubmit={handleSubmit} className="booking-form">
                <button 
                    type="button"
                    className="back-button"
                    onClick={() => navigate(`/restaurant/${id}`)}
                >
                    ↩
                </button>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
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
                    <label htmlFor="guests">Number of Guests:</label>
                    <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                    >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="specialRequests">Special Requests:</label>
                    <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
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
