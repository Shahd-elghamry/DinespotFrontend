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
        }
    ];

    useEffect(() => {
        // Fetch restaurants
        fetch('http://127.0.0.1:5005/resturant')
            .then((response) => response.json())
            .then((data) => setRestaurants(data))
            .catch((error) => console.log("Error fetching restaurants:", error));

        // Slideshow interval
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        // Intersection Observer for scroll animations
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
    }, []);

    return (
        <div className="home-container">
            {/* Slideshow Section */}
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
                    <Link to="/Restaurants" className="see-more-btn">
                        See More
                    </Link>
                </div>

                <div className="restaurant-grid">
                    {restaurants.slice(0, 6).map((restaurant) => (
                        <div key={restaurant.id} className="restaurant-card">
                            <img
                                src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
                                alt={restaurant.name}
                                className="restaurant-image"
                            />
                            <div className="restaurant-info">
                                <h3 className="restaurant-name">{restaurant.name}</h3>
                                <p className="restaurant-description">{restaurant.description}</p>
                                <p className="restaurant-location">
                                    <i className="fas fa-map-marker-alt"></i>
                                    {restaurant.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
