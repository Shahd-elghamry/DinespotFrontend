import React from 'react';
import './PopupStyle.css';

const Popup = ({ type, closePopup }) => {
  const renderContent = () => {
    switch (type) {
      case 'booking':
        return (
          <>
            <h3>Book a Restaurant</h3>
            <form>
              <label htmlFor="restaurant">Choose a Restaurant:</label>
              <select id="restaurant" name="restaurant">
                <option value="restaurant1">Restaurant 1</option>
                <option value="restaurant2">Restaurant 2</option>
              </select>
              <button type="submit">Book</button>
            </form>
          </>
        );
      case 'contact':
        return (
          <>
            <h3>Contact Us</h3>
            <form>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" />
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" />
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message"></textarea>
              <button type="submit">Submit</button>
            </form>
          </>
        );
      case 'complaint':
        return (
          <>
            <h3>File a Complaint</h3>
            <form>
              <label htmlFor="complaint">Your Complaint:</label>
              <textarea id="complaint" name="complaint"></textarea>
              <button type="submit">Submit</button>
            </form>
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
