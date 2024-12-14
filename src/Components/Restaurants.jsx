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
            if (location && location !== "Other") queryParams.append('location', location);
            if (cuisine && cuisine !== "Other") queryParams.append('cuisine', cuisine);
            if (dietary && dietary !== "Other") queryParams.append('dietary', dietary);
            if (halal) queryParams.append('halal', halal);
            if (searchTerm) queryParams.append('searchTerm', searchTerm);
            
            // Construct the full URL with query parameters
            const url = `http://127.0.0.1:5005/resturant/search?${queryParams.toString()}`;

            console.log("Fetching URL:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log("Received data:", data);
            
            // Filter restaurants based on halal status if selected
            const filteredData = halal === "yes" 
                ? data.filter(restaurant => restaurant.halal === "yes")
                : data;
            
            setRestaurants(filteredData);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            setMessage(`Error fetching restaurants: ${error.message}`);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    }, [location, cuisine, dietary, halal, searchTerm]);

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
                            <div className="restaurant-preview">
                                <img 
                                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
                                    alt={restaurant.name} 
                                    className="restaurant-image"
                                />
                                <h2>{restaurant.name}</h2>
                            </div>
                            <div className="restaurant-details">
                                <img 
                                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
                                    alt={restaurant.name} 
                                    className="restaurant-image-large"
                                />
                                <h2>{restaurant.name}</h2>
                                <div className="details-content">
                                    <p><strong>Location:</strong> {restaurant.location}</p>
                                    <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                                    <p><strong>Maximum Capacity:</strong> {restaurant.maxcapacity}</p>
                                    <p><strong>Halal:</strong> {restaurant.halal === "yes" ? 'Yes' : 'No'}</p>
                                    <p><strong>Health Rating:</strong> {restaurant.minHealthRating || 'N/A'}</p>
                                    <p><strong>Dietary Options:</strong> {restaurant.dietary || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RestaurantsComponent;
