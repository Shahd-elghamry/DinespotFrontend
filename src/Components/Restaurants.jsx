import React, { useState, useEffect, useCallback } from "react";
import './Restaurants.css';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

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

            // Handle 404 (No restaurants found) as a valid case
            if (response.status === 404) {
                setRestaurants([]);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${errorText}`);
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
            setMessage(`An error occurred while fetching restaurants. Please try again later.`);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    }, [location, cuisine, dietary, halal]);

    // Trigger search when filters change
    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    // Filter the restaurants based on search term (across all fields)
    const filteredRestaurants = restaurants.filter(restaurant => {
        if (searchTerm.trim() === '') return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            // Search in name
            restaurant.name.toLowerCase().includes(searchLower) ||
            // Search in location
            restaurant.location.toLowerCase().includes(searchLower) ||
            // Search in cuisine
            restaurant.cuisine.toLowerCase().includes(searchLower) ||
            // Search in dietary options
            (restaurant.dietary && restaurant.dietary.toLowerCase().includes(searchLower)) ||
            // Search in halal status
            (searchLower === 'halal' && restaurant.halal === 'yes') ||
            (searchLower === 'non halal' && restaurant.halal === 'no') ||
            // Search in health rating
            (restaurant.minHealthRating && restaurant.minHealthRating.toString().includes(searchLower)) ||
            // Search in maximum capacity
            (restaurant.maxcapacity && restaurant.maxcapacity.toString().includes(searchLower))
        );
    });

    return (
        <div className="restaurants-container">
            <h1 className="Restaurants-Title">Find Your Perfect Dining Experience</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search by name, location, cuisine, dietary options..." 
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
            {loading && <p className="loading-message">Loading restaurants...</p>}
            {message && <p className="error-message">{message}</p>}

            {/* Restaurants List */}
            <div className="restaurants-list">
                {!loading && !message && filteredRestaurants.length === 0 && (
                    <div className="no-results-message">
                        <p>No restaurants with those specifications available.</p>
                        <p>Try adjusting your filters or search criteria.</p>
                    </div>
                )}
                {!loading && !message && filteredRestaurants.length > 0 && (
                    <div className="restaurants-grid">
                        {filteredRestaurants.map((restaurant, index) => (
                            <div 
                                key={index} 
                                className="restaurant-card"
                                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantsComponent;
