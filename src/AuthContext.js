import React, { createContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const storedUserType = localStorage.getItem('userType');
            const userId = localStorage.getItem('userId');

            console.log('AuthProvider - Checking auth state:', {
                hasToken: !!token,
                userType: storedUserType,
                userId: userId
            });
            
            if (token && storedUserType && userId) {
                setIsAuthenticated(true);
                setUserType(storedUserType);
            } else {
                setIsAuthenticated(false);
                setUserType(null);
            }
        };

        checkAuth();
    }, []);

    const login = (token, type, userData) => {
        console.log('AuthContext login called with:', { type, userData });
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', type);
        localStorage.setItem('username', userData.username || '');
        localStorage.setItem('email', userData.email || '');
        
        if (userData.id) {
            localStorage.setItem('userId', userData.id.toString());
        }

        setIsAuthenticated(true);
        setUserType(type);
    };

    const logout = () => {
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
