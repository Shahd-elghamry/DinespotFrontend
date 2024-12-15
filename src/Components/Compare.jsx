import React, { useState, useEffect } from 'react';
import './Compare.css';

const Compare = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurants, setSelectedRestaurants] = useState({
        first: null,
        second: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all restaurants
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5005/resturant');
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }
                const data = await response.json();
                setRestaurants(data || []);
                setError('');
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Error loading restaurants. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleRestaurantSelect = (restaurant, position) => {
        setSelectedRestaurants(prev => ({
            ...prev,
            [position]: restaurant
        }));
    };

    const getDifferenceHighlight = (prop, value1, value2) => {
        if (!value1 || !value2) return '';
        return value1 !== value2 ? 'highlight-difference' : '';
    };

    if (loading) return <div className="loading">Loading restaurants...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="compare-container">
            <h1>Compare Restaurants</h1>
            
            <div className="restaurant-selectors">
                <div className="selector">
                    <h3>First Restaurant</h3>
                    <select 
                        value={selectedRestaurants.first?.id || ''}
                        onChange={(e) => {
                            const restaurant = restaurants.find(r => r.id === parseInt(e.target.value));
                            handleRestaurantSelect(restaurant, 'first');
                        }}
                    >
                        <option value="">Select a restaurant</option>
                        {restaurants.map(restaurant => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="selector">
                    <h3>Second Restaurant</h3>
                    <select 
                        value={selectedRestaurants.second?.id || ''}
                        onChange={(e) => {
                            const restaurant = restaurants.find(r => r.id === parseInt(e.target.value));
                            handleRestaurantSelect(restaurant, 'second');
                        }}
                    >
                        <option value="">Select a restaurant</option>
                        {restaurants.map(restaurant => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedRestaurants.first && selectedRestaurants.second && (
                <div className="comparison-grid">
                    <div className="comparison-row header">
                        <div className="feature">Feature</div>
                        <div className="value">{selectedRestaurants.first.name}</div>
                        <div className="value">{selectedRestaurants.second.name}</div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Location</div>
                        <div className={`value ${getDifferenceHighlight('location', selectedRestaurants.first.location, selectedRestaurants.second.location)}`}>
                            {selectedRestaurants.first.location}
                        </div>
                        <div className={`value ${getDifferenceHighlight('location', selectedRestaurants.first.location, selectedRestaurants.second.location)}`}>
                            {selectedRestaurants.second.location}
                        </div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Cuisine</div>
                        <div className={`value ${getDifferenceHighlight('cuisine', selectedRestaurants.first.cuisine, selectedRestaurants.second.cuisine)}`}>
                            {selectedRestaurants.first.cuisine}
                        </div>
                        <div className={`value ${getDifferenceHighlight('cuisine', selectedRestaurants.first.cuisine, selectedRestaurants.second.cuisine)}`}>
                            {selectedRestaurants.second.cuisine}
                        </div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Halal</div>
                        <div className={`value ${getDifferenceHighlight('halal', selectedRestaurants.first.halal, selectedRestaurants.second.halal)}`}>
                            {selectedRestaurants.first.halal || 'No'}
                        </div>
                        <div className={`value ${getDifferenceHighlight('halal', selectedRestaurants.first.halal, selectedRestaurants.second.halal)}`}>
                            {selectedRestaurants.second.halal || 'No'}
                        </div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Dietary Options</div>
                        <div className={`value ${getDifferenceHighlight('dietary', selectedRestaurants.first.dietary, selectedRestaurants.second.dietary)}`}>
                            {selectedRestaurants.first.dietary || 'None'}
                        </div>
                        <div className={`value ${getDifferenceHighlight('dietary', selectedRestaurants.first.dietary, selectedRestaurants.second.dietary)}`}>
                            {selectedRestaurants.second.dietary || 'None'}
                        </div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Maximum Capacity</div>
                        <div className={`value ${getDifferenceHighlight('maxcapacity', selectedRestaurants.first.maxcapacity, selectedRestaurants.second.maxcapacity)}`}>
                            {selectedRestaurants.first.maxcapacity}
                        </div>
                        <div className={`value ${getDifferenceHighlight('maxcapacity', selectedRestaurants.first.maxcapacity, selectedRestaurants.second.maxcapacity)}`}>
                            {selectedRestaurants.second.maxcapacity}
                        </div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Available Capacity</div>
                        <div className={`value ${getDifferenceHighlight('availablecapacity', selectedRestaurants.first.availablecapacity, selectedRestaurants.second.availablecapacity)}`}>
                            {selectedRestaurants.first.availablecapacity}
                        </div>
                        <div className={`value ${getDifferenceHighlight('availablecapacity', selectedRestaurants.first.availablecapacity, selectedRestaurants.second.availablecapacity)}`}>
                            {selectedRestaurants.second.availablecapacity}
                        </div>
                    </div>

                    <div className="comparison-row">
                        <div className="feature">Minimum Health Rating</div>
                        <div className={`value ${getDifferenceHighlight('minHealthRating', selectedRestaurants.first.minHealthRating, selectedRestaurants.second.minHealthRating)}`}>
                            {selectedRestaurants.first.minHealthRating || 'N/A'}
                        </div>
                        <div className={`value ${getDifferenceHighlight('minHealthRating', selectedRestaurants.first.minHealthRating, selectedRestaurants.second.minHealthRating)}`}>
                            {selectedRestaurants.second.minHealthRating || 'N/A'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;
