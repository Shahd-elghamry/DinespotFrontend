import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRestaurant.css';

const AddRestaurant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        cuisine: '',
        halal: 'no',
        dietary: '',
        image: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Options for select fields
    const locations = ["New Cairo", "Masr El gedida", "Zayed", "Maadi", "Other"];
    const cuisines = ["International", "Italian", "Asian", "Egyptian", "Other"];
    const dietaryOptions = ["Vegetarian", "Lactose", "Other"];

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

            const response = await fetch('http://127.0.0.1:5005/resturant/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Restaurant added successfully!');
                setTimeout(() => {
                    navigate('/restaurant');
                }, 2000);
            } else {
                setError(data.message || 'Failed to add restaurant');
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
                    <label htmlFor="name">Restaurant Name</label>
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
                    <label htmlFor="location">Location</label>
                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="cuisine">Cuisine Type</label>
                    <select
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Cuisine</option>
                        {cuisines.map(cuisine => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="halal">Halal</label>
                    <select
                        id="halal"
                        name="halal"
                        value={formData.halal}
                        onChange={handleChange}
                        required
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="dietary">Dietary Options</label>
                    <select
                        id="dietary"
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleChange}
                    >
                        <option value="">Select Dietary Option</option>
                        {dietaryOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                    />
                    {formData.image && (
                        <img
                            src={formData.image}
                            alt="Restaurant preview"
                            className="image-preview"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter restaurant description"
                        required
                    />
                </div>

                <button type="submit">Add Restaurant</button>
            </form>
        </div>
    );
};

export default AddRestaurant;
