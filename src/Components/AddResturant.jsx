import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRestaurant.css';

const AddRestaurant = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        cuisine: "",
        maxcapacity: "",
        halal: "",
        minHealthRating: "",
        dietary: ""
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        
        if (!token) {
            alert("Please log in to add a restaurant.");
            navigate("/Login");
            return;
        }
        try {
            // Decode the JWT token to get the user ID
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenPayload.id;

            const response = await fetch("http://127.0.0.1:5005/addresturant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    owner_id: userId 
                })
            });

            if (response.ok) {
                const message = await response.text();
                alert(message);
                navigate("/restaurant");
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (err) {
            console.error("Error adding restaurant:", err);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="add-restaurant-container">
            <h1>Add a Restaurant</h1>
            <form onSubmit={handleSubmit} className="add-restaurant-form">
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Cuisine:
                    <input
                        type="text"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Maximum Capacity:
                    <input
                        type="number"
                        name="maxcapacity"
                        value={formData.maxcapacity}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Halal:
                    <select
                        name="halal"
                        value={formData.halal}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Halal Status</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </label>
                <label>
                    Minimum Health Rating:
                    <input
                        type="text"
                        name="minHealthRating"
                        value={formData.minHealthRating}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Dietary Options:
                    <input
                        type="text"
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Add Restaurant</button>
            </form>
        </div>
    );
};

export default AddRestaurant;
