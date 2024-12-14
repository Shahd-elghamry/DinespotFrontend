import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.1)', 
            position: 'fixed', 
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 10, 
            pointerEvents: 'none' 
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '90%',
                border: '2px solid black',
                pointerEvents: 'auto' 
            }}>
                <h1 style={{
                    fontSize: '4rem', 
                    color: '#333',
                    margin: '0 0 20px 0',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>404</h1>
                <h2 style={{
                    fontSize: '2rem', 
                    color: '#666',
                    marginBottom: '20px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>Page Not Found</h2>
                <p style={{
                    marginBottom: '30px', 
                    color: '#777',
                    lineHeight: '1.6'
                }}>
                    The page you are looking for does not exist or has been moved.
                    Please check the URL or return to the homepage.
                </p>
                <Link 
                    to="/" 
                    style={{
                        display: 'inline-block',
                        padding: '12px 25px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#0056b3';
                        e.target.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
