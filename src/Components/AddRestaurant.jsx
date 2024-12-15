import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRestaurant.css';

const AddRestaurant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        cuisine: '',
        maxcapacity: '',
        halal: 'no',
        minHealthRating: '',
        dietary: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('You must be logged in to add a restaurant');
                navigate('/login');
                return;
            }

            const response = await fetch('http://127.0.0.1:5005/addresturant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.text();

            if (response.ok) {
                setSuccess('Restaurant added successfully!');
                setTimeout(() => {
                    navigate('/restaurant');
                }, 2000);
            } else {
                setError(data || 'Failed to add restaurant');
            }
        } catch (error) {
            setError('Error adding restaurant. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="add-restaurant-container">
            <form className="add-restaurant-form" onSubmit={handleSubmit}>
                <h1>Add New Restaurant</h1>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <label htmlFor="name">Restaurant Name*</label>
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
                    <label htmlFor="location">Location*</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cuisine">Cuisine Type*</label>
                    <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="maxcapacity">Maximum Capacity*</label>
                    <input
                        type="number"
                        id="maxcapacity"
                        name="maxcapacity"
                        value={formData.maxcapacity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="halal">Halal</label>
                    <select
                        id="halal"
                        name="halal"
                        value={formData.halal}
                        onChange={handleChange}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="minHealthRating">Minimum Health Rating</label>
                    <select
                        id="minHealthRating"
                        name="minHealthRating"
                        value={formData.minHealthRating}
                        onChange={handleChange}
                    >
                        <option value="">Select Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="dietary">Dietary Options</label>
                    <input
                        type="text"
                        id="dietary"
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleChange}
                        placeholder="e.g., Vegetarian, Lactose-free"
                    />
                </div>

                <button type="submit">Add Restaurant</button>
            </form>
        </div>
    );
};

export default AddRestaurant;
