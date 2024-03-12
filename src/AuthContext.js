import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Read the logged-in state from localStorage when the app loads
        const isAuth = localStorage.getItem('isLoggedIn');
        return isAuth === 'true'; // Convert string to boolean
    });

    // Function to handle user login
    const login = (athleteId) => {
        setIsLoggedIn(true); // Update login state
        localStorage.setItem('athleteId', athleteId); // Store athleteId in localStorage
    };

    // Function to handle user logout
    const logout = () => {
        setIsLoggedIn(false); // Update login state
        localStorage.removeItem('athleteId'); // Remove athleteId from localStorage
    };

    // Use useEffect to update localStorage when isLoggedIn changes
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
        // Optionally, clear athleteId from localStorage if user logs out
        if (!isLoggedIn) {
            localStorage.removeItem('athleteId');
        }
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
