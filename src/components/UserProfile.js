import React, { useState } from 'react';
import './Component.css'; // Make sure this is the correct path to your CSS file

function UserRegistration() {
    // State hooks for registration information
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const validateEmail = (email) => {
        // Basic regex pattern to check if the email follows the structure letters/numbers@someUrl.com
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    const handleRegistrationSubmit = async () => {
        // Validate email before proceeding
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return; // Stop the submission if the email is invalid
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    password,
                    email,
                    dateOfBirth, // Make sure to handle this on the server side
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Handle successful submission, e.g., notify user or redirect
                window.location.href = '/login'; // Redirect to login page after successful registration
            } else {
                // Handle errors, e.g., display a message to the user
                alert(data.error || 'An error occurred during registration.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div className="login-container">
            <div className="title">Sign Up</div>
            <input
                className="input-field"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
            />
            <input
                className="input-field"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
            />
            <input
                className="input-field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" // HTML5 validation for immediate feedback
                title="Please enter a valid email address."
            />
            <input
                className="input-field"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder="Date of Birth"
            />
            <button className="login-button" onClick={handleRegistrationSubmit}>Register</button>
        </div>
    );
}

export default UserRegistration;
