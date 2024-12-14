import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Restaurants.css';
import { restaurants } from '../sampleData';

const RestaurantsComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [selectedDietary, setSelectedDietary] = useState('');
    const [restaurantList, setRestaurantList] = useState(restaurants); // Use sample data

    // Get unique cuisines from sample data
    const cuisineTypes = [...new Set(restaurants.map(restaurant => restaurant.cuisine))];
    
    // Get unique dietary options from sample data
    const dietaryOptions = [...new Set(restaurants.flatMap(restaurant => restaurant.dietary))];

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        filterRestaurants(event.target.value, selectedCuisine, selectedDietary);
    };

    const handleCuisineFilter = (event) => {
        setSelectedCuisine(event.target.value);
        filterRestaurants(searchTerm, event.target.value, selectedDietary);
    };

    const handleDietaryFilter = (event) => {
        setSelectedDietary(event.target.value);
        filterRestaurants(searchTerm, selectedCuisine, event.target.value);
    };

    const filterRestaurants = (search, cuisine, dietary) => {
        let filtered = restaurants;

        if (search) {
            filtered = filtered.filter(restaurant =>
                restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
                restaurant.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (cuisine) {
            filtered = filtered.filter(restaurant =>
                restaurant.cuisine === cuisine
            );
        }

        if (dietary) {
            filtered = filtered.filter(restaurant =>
                restaurant.dietary.includes(dietary)
            );
        }

        setRestaurantList(filtered);
    };

    return (
        <div className="restaurants-container">
            <h1 className="Restaurants-Title">Find Your Perfect Dining Experience</h1>

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <select
                    value={selectedCuisine}
                    onChange={handleCuisineFilter}
                    className="filter-select"
                >
                    <option value="">All Cuisines</option>
                    {cuisineTypes.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                </select>
                <select
                    value={selectedDietary}
                    onChange={handleDietaryFilter}
                    className="filter-select"
                >
                    <option value="">All Dietary Options</option>
                    {dietaryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="restaurants-grid">
                {restaurantList.map(restaurant => (
                    <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="restaurant-card">
                        <img src={restaurant.images[0]} alt={restaurant.name} className="restaurant-image" />
                        <div className="restaurant-info">
                            <h3>{restaurant.name}</h3>
                            <p className="cuisine">{restaurant.cuisine}</p>
                            <p className="location">{restaurant.location}</p>
                            <div className="rating">
                                <span className="stars">{'★'.repeat(Math.floor(restaurant.rating))}</span>
                                <span className="rating-number">{restaurant.rating}</span>
                            </div>
                            <div className="dietary-tags">
                                {restaurant.dietary.map((tag, index) => (
                                    <span key={index} className="dietary-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RestaurantsComponent;
