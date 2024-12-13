import React, { useState, useEffect } from "react";
import { apiCall } from "../utils/api"; 

const RestaurantsComponent = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("all"); // For example, can be based on user filters

    // Fetch restaurants with type or other dependencies
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            apiCall('/restaurants')  // Use your API function to call the endpoint
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
    }, [type]);

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

