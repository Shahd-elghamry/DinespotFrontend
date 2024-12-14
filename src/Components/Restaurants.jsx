import React, { useState, useEffect, useCallback } from "react";
import './Restaurants.css';

const RestaurantsComponent = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [halal, setHalal] = useState("");
    const [dietary, setDietary] = useState("");
    const [availableCapacity, setAvailableCapacity] = useState("");

    // Locations and cuisines
    const locations = ["New Cairo", "Masr El gedida", "Zayed", "Maadi", "Other"];
    const cuisines = ["International", "Italian", "Asian", "Egyptian", "Other"];
    const dietaryOptions = ["Vegetarian", "Lactose", "Other"];

    // Fetch restaurants with search parameters
    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        setMessage(""); // Clear previous messages
        try {
            // Construct query parameters
            const queryParams = new URLSearchParams();
            
            // Add filters to query parameters
            if (searchTerm) queryParams.append('searchTerm', searchTerm);
            if (location && location !== "Other") queryParams.append('location', location);
            if (cuisine && cuisine !== "Other") queryParams.append('cuisine', cuisine);
            if (dietary && dietary !== "Other") queryParams.append('dietary', dietary);
            if (halal === "yes") queryParams.append('halal', 'true');
            if (availableCapacity) queryParams.append('availableCapacity', availableCapacity);
            
            // Construct the full URL with query parameters
            const url = `http://127.0.0.1:5005/resturant/search?${queryParams.toString()}`;

            console.log("Fetching URL:", url); // Log the exact URL being called

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log("Response status:", response.status); // Log response status

            if (!response.ok) {
                // Try to get more details about the error
                const errorText = await response.text();
                console.error("Error response text:", errorText);
                throw new Error(`Failed to fetch restaurants. Status: ${response.status}, Message: ${errorText}`);
            }

            const data = await response.json();
            console.log("Received data:", data); // Log received data
            
            setRestaurants(data);
        } catch (error) {
            console.error("Complete error details:", error);
            setMessage(`Error fetching restaurants: ${error.message}`);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, location, cuisine, dietary, halal, availableCapacity]);

    // Trigger search when filters change
    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    return (
        <div className="restaurants-container">
            <h1>Find Your Perfect Dining Experience</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search restaurants..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="filters-container">
                {/* Location Filter */}
                <select 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>

                {/* Cuisine Filter */}
                <select 
                    value={cuisine} 
                    onChange={(e) => setCuisine(e.target.value)}
                >
                    <option value="">Select Cuisine</option>
                    {cuisines.map(cui => (
                        <option key={cui} value={cui}>{cui}</option>
                    ))}
                </select>

                {/* Available Capacity */}
                <input 
                    type="number" 
                    placeholder="Min. Available Capacity" 
                    value={availableCapacity}
                    onChange={(e) => setAvailableCapacity(e.target.value)}
                />

                {/* Halal Filter */}
                <select 
                    value={halal} 
                    onChange={(e) => setHalal(e.target.value)}
                >
                    <option value="">Halal?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                {/* Dietary Options */}
                <select 
                    value={dietary} 
                    onChange={(e) => setDietary(e.target.value)}
                >
                    <option value="">Dietary Options</option>
                    {dietaryOptions.map(diet => (
                        <option key={diet} value={diet}>{diet}</option>
                    ))}
                </select>
            </div>

            {/* Loading and Error States */}
            {loading && <p>Loading restaurants...</p>}
            {message && <p className="error-message">{message}</p>}

            {/* Restaurants List */}
            <div className="restaurants-list">
                {restaurants.length === 0 ? (
                    <p>No restaurants match your criteria.</p>
                ) : (
                    restaurants.map((restaurant, index) => (
                        <div key={index} className="restaurant-card">
                            <h2>{restaurant.name}</h2>
                            <p>Location: {restaurant.location}</p>
                            <p>Cuisine: {restaurant.cuisine}</p>
                            <p>Available Capacity: {restaurant.availableCapacity}</p>
                            <p>Halal: {restaurant.halal ? 'Yes' : 'No'}</p>
                            <p>Dietary Options: {restaurant.dietary}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantsComponent;
