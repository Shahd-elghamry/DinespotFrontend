import React, { useState, useEffect } from 'react';
import './PopupStyle.css';

const BASE_URL = 'http://127.0.0.1:5005';

const Popup = ({ type, closePopup, token }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        setEmail(decoded.email || ''); // Set the email if available
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, [token]);

  useEffect(() => {
    if (type === 'booking') {
      setLoading(true);
      fetch(`${BASE_URL}/restaurants`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
          }
          return response.json();
        })
        .then((data) => setRestaurants(data))
        .catch((error) => {
          console.error('Error fetching restaurants:', error);
          setMessage(`Error fetching restaurants: ${error.message}`);
        })
        .finally(() => setLoading(false));
    }
  }, [type]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      setMessage('Please select a restaurant.');
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restaurant: selectedRestaurant }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to book the restaurant');
        }
        return response.json();
      })
      .then((data) => {
        setMessage('Booking successful');
        setSelectedRestaurant('');
      })
      .catch((error) => {
        console.error('Error booking restaurant:', error);
        setMessage(`Error booking restaurant: ${error.message}`);
      })
      .finally(() => setLoading(false));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!email || !question) {
      setMessage('All fields (email and question) are required.');
      return;
    }
    setLoading(true);
    fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        question,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        if (!token) setEmail(''); // Clear email only for guest users
        setQuestion('');
      })
      .catch((error) => {
        console.error('Error sending contact message:', error);
        setMessage(`Error: ${error.message}`);
      })
      .finally(() => setLoading(false));
  };

  const renderContent = () => {
    switch (type) {
      case 'booking':
        return (
          <>
            <h3>Book a Restaurant</h3>
            <form onSubmit={handleBookingSubmit}>
              <label htmlFor="restaurant">Choose a Restaurant:</label>
              <select
                id="restaurant"
                name="restaurant"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Book'}
              </button>
            </form>
            {message && <p>{message}</p>}
          </>
        );
      case 'contact':
        return (
          <>
            <h3>Contact Us</h3>
            <form onSubmit={handleContactSubmit}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <label>Your Question:</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
              <br />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {message && <p>{message}</p>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="back-button" onClick={closePopup}>Back</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default Popup;
