import React, { useState, useEffect } from "react";

const RestaurantsComponent = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch restaurants with type or other dependencies
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            fetch('http://127.0.0.1:5005/restaurants')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch restaurants');
                    }
                    return response.json();
                })
                .then((data) => {
                    setRestaurants(data);
                })
                .catch((error) => {
                    console.error("Error fetching restaurants:", error);
                    setMessage(`Error fetching restaurants: ${error.message}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchData();  // Call fetchData every time type changes or on component mount
    }, []);

    return (
        <div>
            <h1>Restaurants</h1>

            {loading && <p>Loading...</p>}
            
            {message && <p>{message}</p>}
            
            <ul>
                {restaurants.map((restaurant, index) => (
                    <li key={index}>{restaurant.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantsComponent;
