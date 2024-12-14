import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        console.log('AuthProvider: Checking authentication...');
        const token = localStorage.getItem('authToken');
        const storedUserType = localStorage.getItem('userType');
        
        console.log('Token exists:', !!token);
        console.log('Stored user type:', storedUserType);
        
        if (token) {
            setIsAuthenticated(true);
            if (storedUserType) {
                setUserType(storedUserType);
            }
        }
    }, []);

    const login = (token, type) => {
        console.log('Login called with token:', !!token, 'type:', type);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', type);
        setIsAuthenticated(true);
        setUserType(type);
    };

    const logout = () => {
        console.log('Logout called');
        localStorage.clear();
        setIsAuthenticated(false);
        setUserType(null);
    };

    const value = {
        isAuthenticated,
        userType,
        setUserType,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext);
    console.log('PrivateRoute: isAuthenticated =', isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};
