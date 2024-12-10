import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRestaurant = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [maxCapacity, setMaxCapacity] = useState("");
    const [halal, setHalal] = useState("No");
    const [minHealthRating, setMinHealthRating] = useState("");
    const [dietary, setDietary] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); 

    const addRestaurant = () => {
        fetch('http://127.0.0.1:5005/addrestaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                location,
                cuisine,
                max_capacity: parseInt(maxCapacity, 10),
                halal,
                min_health_rating: minHealthRating,
                dietary,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to add restaurant');
            }
            setMessage('Restaurant added successfully');
            alert('Restaurant added successfully');

            navigate('/lists');  
        })
        .catch((error) => {
            setMessage(`Error: ${error.message}`);
            alert(error.message);
        });
    }

    return (
        <div>
            <h1>Add a Restaurant</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); 
                    addRestaurant();
                }}
            >
                <label>Restaurant Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />

                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <br />

                <label>Cuisine:</label>
                <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                />
                <br />

                <label>Max Capacity:</label>
                <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                />
                <br />

                <label>Halal:</label>
                <select
                    value={halal}
                    onChange={(e) => setHalal(e.target.value)}
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <br />

                <label>Minimum Health Rating:</label>
                <input
                    type="text"
                    value={minHealthRating}
                    onChange={(e) => setMinHealthRating(e.target.value)}
                />
                <br />

                <label>Dietary Options:</label>
                <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                />
                <br />

                <button type="submit">Add Restaurant</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddRestaurant;
