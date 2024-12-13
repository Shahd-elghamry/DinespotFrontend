import React, { useState } from 'react';
import Popup from './Popup';
import './Footerstyle.css';

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
          <h2>DINESPOT</h2>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><button onClick={() => openPopup('booking')}>Booking</button></li>
            <li><a href="/faq">FAQ</a></li>
            <li><button onClick={() => openPopup('contact')}>Contact</button></li>
          </ul>
        </div>
        <div className="footer-social">
          <a href="#"><i className="icon-facebook"></i></a>
          <a href="#"><i className="icon-twitter"></i></a>
          <a href="#"><i className="icon-instagram"></i></a>
        </div>
      </div>

      {popupType && (
        <Popup type={popupType} closePopup={closePopup} />
      )}
    </footer>
  );
};

export default Footer;