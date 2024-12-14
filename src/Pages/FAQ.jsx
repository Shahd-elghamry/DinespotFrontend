import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import '../Styles/FAQ.css';

const FAQ = () => {
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, []);

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
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
      .then(() => {
        alert('Message sent successfully!');
        setQuestion('');
        if (!localStorage.getItem('authToken')) {
          setEmail('');
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const faqItems = [
    {
      question: "How do I make a restaurant reservation?",
      answer: "You can make a reservation in two ways: 1) Click the 'Booking' link in the footer, select your restaurant and fill in your booking details, or 2) Browse restaurants, select one you like, and click the 'Book Now' button on the restaurant's page. You must be logged in to make a reservation."
    },
    {
      question: "How can I view available restaurants?",
      answer: "Click on the 'Restaurants' link in the navigation bar. You can filter restaurants by location, cuisine type, and dietary preferences. You can also use the search bar to find specific restaurants."
    },
    {
      question: "What information do I need to make a booking?",
      answer: "To make a booking, you'll need to specify: the date of your visit, preferred time, and number of guests. You can also add any special requests or notes for the restaurant."
    },
    {
      question: "I'm a restaurant owner. How can I add my restaurant?",
      answer: "First, register an account as a restaurant owner. After registration, you'll be able to add your restaurant's details including name, location, cuisine type, and other important information through your dashboard."
    },
    {
      question: "How do I modify or cancel my reservation?",
      answer: "You can manage your reservations through your profile page. Find the booking you want to modify or cancel and use the corresponding options. Please note that it's courteous to cancel reservations at least 2 hours in advance."
    }
  ];

  return (
    <div className="faq-container">
      <div className="contact-section">
        <h2>Contact Us</h2>
        <form onSubmit={handleContactSubmit}>
          {!localStorage.getItem('authToken') ? (
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                disabled
                className="disabled-input"
              />
            </div>
          )}
          <div className="form-group">
            <label>Question:</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows="4"
              placeholder="How can we help you?"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
