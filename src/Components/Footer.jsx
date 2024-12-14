import React, { useState } from 'react';
import Popup from './Popup';
import './Footerstyle.css';
import DinespotLogo from '../photos/DinespotLogo.jpg';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [popupType, setPopupType] = useState(null);

  const openPopup = (type) => {
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupType(null);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={DinespotLogo} alt="Dinespot Logo" className="footer-logo-image" />
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><button onClick={() => openPopup('booking')}>Booking</button></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><button onClick={() => openPopup('contact')}>Contact</button></li>
          </ul>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com/dinespot" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="icon-facebook"></i>
          </a>
          <a href="https://www.twitter.com/dinespot" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="icon-twitter"></i>
          </a>
          <a href="https://www.instagram.com/dinespot" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="icon-instagram"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom-logo">
        <img src={DinespotLogo} alt="Dinespot Logo" className="footer-bottom-logo-image" />
      </div>

      {popupType && (
        <Popup type={popupType} closePopup={closePopup} />
      )}
    </footer>
  );
};

export default Footer;