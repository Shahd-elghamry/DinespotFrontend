import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupStyle.css';

const BASE_URL = 'http://127.0.0.1:5005';

const Popup = ({ type, closePopup }) => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (type === 'booking') {
      setLoading(true);
      fetch(`${BASE_URL}/resturant`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
          }
          return response.json();
        })
        .then((data) => {
          if (!data || data.length === 0) {
            setMessage('No restaurants available at the moment.');
          } else {
            setRestaurants(data);
            setMessage('');
          }
        })
        .catch((error) => {
          console.error('Error fetching restaurants:', error);
          setMessage('Unable to load restaurants. Please try again later.');
        })
        .finally(() => setLoading(false));
    } else if (type === 'contact') {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          setEmail(payload.email || '');
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }
    }
  }, [type]);

  const handleRestaurantSelect = (e) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Please log in first to book a restaurant');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    setSelectedRestaurant(e.target.value);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Please log in first to book a restaurant');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    if (!selectedRestaurant || !bookingDate || !bookingTime || !numberOfPeople) {
      setMessage('Please fill in all booking details.');
      return;
    }

    const selectedRestaurantData = restaurants.find(r => r.id === parseInt(selectedRestaurant));
    if (!selectedRestaurantData) {
      setMessage('Please select a valid restaurant.');
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/resturant/book`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: selectedRestaurantData.name,
        date: bookingDate,
        time: bookingTime,
        quantity: numberOfPeople,
        special_requests: ''
      }),
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            throw new Error('Please log in to book a restaurant');
          }
          return response.text().then(text => {
            throw new Error(text || 'Failed to book the restaurant');
          });
        }
        return response.text();
      })
      .then((data) => {
        setMessage('Booking successful! ' + data);
        setShowBookingForm(false);
        setSelectedRestaurant('');
        setBookingDate('');
        setBookingTime('');
        setNumberOfPeople(1);
      })
      .catch((error) => {
        console.error('Error booking restaurant:', error);
        setMessage(error.message);
        if (error.message.includes('Please log in')) {
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!email || !question) {
      alert('All fields are required.');
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
        alert('Message sent successfully!');
        setQuestion('');
        if (!localStorage.getItem('authToken')) {
          setEmail('');
        }
        closePopup(); // Close the popup after successful submission
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="back-button" onClick={closePopup}>←</button>
        {type === 'booking' ? (
          <div>
            <h3>Restaurant Booking</h3>
            <form onSubmit={handleBookingSubmit}>
              <label>
                Select Restaurant:
                <select 
                  value={selectedRestaurant} 
                  onChange={handleRestaurantSelect}
                  required
                >
                  <option value="">Choose a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </label>

              {showBookingForm && (
                <>
                  <label>
                    Date:
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </label>

                  <label>
                    Time:
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Number of People:
                    <input
                      type="number"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                      min="1"
                      max="20"
                      required
                    />
                  </label>
                </>
              )}

              {showBookingForm && (
                <button type="submit" disabled={loading}>
                  {loading ? 'Booking...' : 'Book Now'}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div>
            <h3>Contact Us</h3>
            <form onSubmit={handleContactSubmit}>
              {!localStorage.getItem('authToken') && (
                <label>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              )}
              <label>
                Question:
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        )}
        {message && <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>}
      </div>
    </div>
  );
};

export default Popup;
