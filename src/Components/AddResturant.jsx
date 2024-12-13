import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRestaurant = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [maxCapacity, setMaxCapacity] = useState("");
    const [halal, setHalal] = useState("");
    const [minHealthRating, setMinHealthRating] = useState("");
    const [dietary, setDietary] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); 

     const addRestaurant = () => {
        if (!name || !location || !cuisine || !maxCapacity) {
            setMessage('Please fill in all required fields.');
            return;
        }

        fetch("http://127.0.0.1:5005/addresturant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            
            body: JSON.stringify({
                name,
                location,
                cuisine,
                maxcapacity: parseInt(maxCapacity, 10),
                halal: halal || "No",
                min_of_health: minHealthRating,
                dietary: dietary
            }),
        })
        .then((response) => {
            if (response.status === 409) {
                throw new Error('Restaurant already exists with the same name and location.');
            }
            else if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
            return response.text();
        })

        .then((data) => {
            setMessage('Restaurant added successfully');
            alert('Restaurant added successfully');
            navigate('/Restaurants');
        })

        .catch((error) => {
            console.error('Error while adding restaurant:', error);
            setMessage(`Error: ${error.message}`);
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
                    required
                />
                <br />

                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <br />

                <label>Cuisine:</label>
                <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    required
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
