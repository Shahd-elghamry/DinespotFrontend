import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());
    const featuredRef = useRef(null);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            title: "Discover Amazing Restaurants",
            description: "Find the perfect dining experience"
        },
        {
            image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b",
            title: "Exquisite Dining",
            description: "Experience culinary excellence"
        },
        {
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
            title: "Perfect Ambiance",
            description: "Create memorable moments"
        },
        {
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
            title: "Gourmet Delights",
            description: "Savor exceptional flavors"
        },
        {
            image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88",
            title: "Fine Dining",
            description: "Elevate your dining experience"
        },
        {
            image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
            title: "Local Favorites",
            description: "Discover hidden gems"
        },
        {
            image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
            title: "Outdoor Dining",
            description: "Enjoy meals with a view"
        },
        {
            image: "https://images.unsplash.com/photo-1554679665-f5537f187268",
            title: "International Cuisine",
            description: "Travel the world through food"
        },
        {
            image: "https://images.unsplash.com/photo-1592861956120-e524fc739696",
            title: "Family Gatherings",
            description: "Create lasting memories"
        },
        {
            image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
            title: "Casual Dining",
            description: "Relaxed and comfortable atmosphere"
        }
    ];

    useEffect(() => {
        // Fetch restaurants
        fetch('http://127.0.0.1:5005/resturant')
            .then((response) => response.json())
            .then((data) => setRestaurants(data))
            .catch((error) => console.log("Error fetching restaurants:", error));

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set(prev).add(entry.target.id));
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (featuredRef.current) {
            observer.observe(featuredRef.current);
        }

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, [slides.length]);

    return (
        <div className="home-container">
            <div className="slideshow">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slide-content">
                            <h2>{slide.title}</h2>
                            <p>{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Featured Restaurants Section */}
            <div
                id="featured-restaurants"
                ref={featuredRef}
                className={`featured-restaurants ${
                    visibleSections.has('featured-restaurants') ? 'visible' : ''
                }`}
            >
                <div className="section-header">
                    <h2>Featured Restaurants</h2>
                    {restaurants.length > 5 && (
                        <Link to="/restaurant" className="see-more-btn">
                            See All
                        </Link>
                    )}
                </div>

                <div className="restaurant-scroll">
                    <div className="restaurant-row">
                        {restaurants.slice(0, 5).map((restaurant) => (
                            <div key={restaurant.id} className="restaurant-card">
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
                </div>
            </div>
        </div>
    );
};

export default Home;
