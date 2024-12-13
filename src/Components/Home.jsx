import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [ 
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripadvisor.com%2FRestaurants-g294201-Cairo_Cairo_Governorate.html&psig=AOvVaw3xjsF2F82ofeXDOGHWboAk&ust=1734143110172000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiz7tDYo4oDFQAAAAAdAAAAABAE",
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.egypttoursportal.com%2Fen-gb%2Fblog%2Frestaurants-in-cairo%2F&psig=AOvVaw3xjsF2F82ofeXDOGHWboAk&ust=1734143110172000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiz7tDYo4oDFQAAAAAdAAAAABAa",
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripadvisor.com%2FRestaurants-g294201-Cairo_Cairo_Governorate.html&psig=AOvVaw3xjsF2F82ofeXDOGHWboAk&ust=1734143110172000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiz7tDYo4oDFQAAAAAdAAAAABAh"
    ]

    useEffect(() => {
        fetch('/resturant')
          .then((response) => response.json())
          .then((data) => setRestaurants(data))
          .catch((error) => console.log("Error fetching restaurants:", error));
      }, []);

      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 3000); // 3 seconds
        return () => clearInterval(interval); 
      }, []);

  return (
    <div>
      <h2>All Restaurants</h2>
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <p>Location: {restaurant.location}</p>
          </div>
        ))}
      </div>
    </div>
  );

};

export default Home;
