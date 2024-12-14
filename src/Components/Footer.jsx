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
        {/* <div className="footer-social">
          <span className="social-icon"><i className="icon-facebook"></i></span>
          <span className="social-icon"><i className="icon-twitter"></i></span>
          <span className="social-icon"><i className="icon-instagram"></i></span>
        </div> */}
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