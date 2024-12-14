import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5005/resturant/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Restaurant not found');
                }
                return response.json();
            })
            .then(data => {
                setRestaurant(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!restaurant) return <div className="error">Restaurant not found</div>;

    // Calculate average rating
    const averageRating = restaurant.reviews ? 
        restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) / restaurant.reviews.length : 
        0;

    const ratingPercentage = (averageRating / 5) * 100;

    return (
        <div className="restaurant-details-container">
            <div className="header-section">
                <h1 className="restaurant-name">{restaurant.name}</h1>
                <button 
                    className="book-button"
                    onClick={() => navigate(`/booking/${id}`)}
                >
                    Book Restaurant
                </button>
            </div>

            <div className="rating-section">
                <div className="rating-bar-container">
                    <div 
                        className="rating-bar-fill" 
                        style={{ width: `${ratingPercentage}%` }}
                    />
                </div>
                <span className="rating-text">
                    {averageRating.toFixed(1)} ({restaurant.reviews ? restaurant.reviews.length : 0} reviews)
                </span>
            </div>

            <div className="location-info">
                <p>{restaurant.location}</p>
            </div>

            <div className="action-links">
                <button 
                    className="action-link"
                    onClick={() => {}}
                >
                    Website
                </button>
                <button 
                    className="action-link"
                    onClick={() => {}}
                >
                    Menu
                </button>
                <button 
                    className="action-link"
                    onClick={() => {}}
                >
                    Location
                </button>
            </div>

            <div className="restaurant-image-container">
                <img 
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
                    alt={restaurant.name}
                    className="restaurant-detail-image"
                />
            </div>
        </div>
    );
};

export default RestaurantDetails;
