import React from 'react';
import { Link } from 'react-router-dom'; 

import './Navbar.css'; 

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>Dinespot</h1>
            </div>
            <ul className="navbar-lists">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Lists">Lists</Link></li>
                <li><Link to="/Contact">Contact</Link></li>
            </ul>
            <ul className='navbar-auth'>
                <li><Link to="/Login">Login</Link></li>
                <li><Link to="/Register">Register</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;


