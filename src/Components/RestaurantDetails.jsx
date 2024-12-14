import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({
        rating: 5,
        content: ''
    });
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    const fetchRestaurantDetails = useCallback(() => {
        setLoading(true);
        Promise.all([
            // Fetch restaurant details
            fetch(`http://127.0.0.1:5005/resturant/${id}`),
            // Fetch restaurant reviews
            fetch(`http://127.0.0.1:5005/review/${id}`)
        ])
        .then(async ([restaurantRes, reviewsRes]) => {
            if (!restaurantRes.ok) throw new Error('Restaurant not found');
            
            const restaurantData = await restaurantRes.json();
            let reviewsData = [];
            
            if (reviewsRes.ok) {
                reviewsData = await reviewsRes.json();
            }
            // If reviews fetch returns 404, it means no reviews yet
            else if (reviewsRes.status === 404) {
                reviewsData = [];
            }

            setRestaurant({
                ...restaurantData,
                reviews: reviewsData
            });
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        fetchRestaurantDetails();
    }, [fetchRestaurantDetails]);

    const handleBookClick = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please log in first to book a restaurant');
            navigate('/login');
            return;
        }
        navigate(`/booking/${id}`);
    };

    const handleAddReviewClick = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please log in first to add a review');
            navigate('/login');
            return;
        }
        setShowReviewForm(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');

        const token = localStorage.getItem('authToken');
        if (!token) {
            setReviewError('Please log in to submit a review');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5005/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    restaurant_id: parseInt(id),
                    rating: parseInt(reviewFormData.rating),
                    review: reviewFormData.content
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to submit review');
            }

            // Create a temporary review object for immediate feedback
            const tempReview = {
                rating: parseInt(reviewFormData.rating),
                review: reviewFormData.content,
                created_at: new Date().toISOString(),
                userName: 'You'
            };

            // Update UI immediately
            setRestaurant(prevRestaurant => ({
                ...prevRestaurant,
                reviews: [tempReview, ...(prevRestaurant.reviews || [])]
            }));

            setReviewSuccess('Review submitted successfully!');
            setShowReviewForm(false);
            setReviewFormData({ rating: 5, content: '' });

            // Fetch updated reviews
            const reviewsResponse = await fetch(`http://127.0.0.1:5005/review/${id}`);
            if (reviewsResponse.ok) {
                const updatedReviews = await reviewsResponse.json();
                setRestaurant(prevRestaurant => ({
                    ...prevRestaurant,
                    reviews: updatedReviews
                }));
            }
        } catch (err) {
            console.error('Review submission error:', err);
            setReviewError(err.message || 'Error submitting review. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const averageRating = useMemo(() => {
        if (!restaurant?.reviews?.length) return 0;
        const total = restaurant.reviews.reduce((acc, review) => acc + review.rating, 0);
        return total / restaurant.reviews.length;
    }, [restaurant?.reviews]);

    const ratingPercentage = (averageRating / 5) * 100;

    const renderReviews = () => {
        if (!restaurant?.reviews?.length) {
            return (
                <div className="no-reviews">
                    <p>No reviews yet.</p>
                    <button 
                        className="add-first-review-button"
                        onClick={handleAddReviewClick}
                    >
                        Be the first to review!
                    </button>
                </div>
            );
        }

        return (
            <div className="reviews-section">
                <div className="reviews-header">
                    <h2 className="reviews-title">Reviews ({restaurant.reviews.length})</h2>
                    <button className="add-review-btn" onClick={handleAddReviewClick}>
                        Add Review
                    </button>
                </div>
                <div className="reviews-list">
                    {restaurant.reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <span className="review-author">{review.userName || 'Anonymous'}</span>
                                <span className="review-date">{formatDate(review.created_at || new Date().toISOString())}</span>
                            </div>
                            <div className="rating-display">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                                ))}
                            </div>
                            <p className="review-content">{review.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!restaurant) return <div className="error">Restaurant not found</div>;

    return (
        <div className="restaurant-details-container">
            <div className="header-section">
                <h1 className="restaurant-name">{restaurant.name}</h1>
                <button 
                    className="book-button"
                    onClick={handleBookClick}
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

            <div className="reviews-section">
                {reviewError && <div className="error-message">{reviewError}</div>}
                {reviewSuccess && <div className="success-message">{reviewSuccess}</div>}

                {showReviewForm && (
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                        <div className="rating-input">
                            <label htmlFor="rating">Rating:</label>
                            <select
                                id="rating"
                                value={reviewFormData.rating}
                                onChange={(e) => setReviewFormData(prev => ({
                                    ...prev,
                                    rating: parseInt(e.target.value)
                                }))}
                            >
                                {[5, 4, 3, 2, 1].map(num => (
                                    <option key={num} value={num}>{num} Stars</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            placeholder="Write your review here..."
                            value={reviewFormData.content}
                            onChange={(e) => setReviewFormData(prev => ({
                                ...prev,
                                content: e.target.value
                            }))}
                            required
                        />
                        <div className="form-buttons">
                            <button type="submit" className="submit-review-button">
                                Submit Review
                            </button>
                            <button 
                                type="button" 
                                className="add-review-button"
                                onClick={() => setShowReviewForm(false)}
                                style={{ marginLeft: '10px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {renderReviews()}
            </div>
        </div>
    );
};

export default RestaurantDetails;
