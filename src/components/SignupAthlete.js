import React, { useState, useEffect } from 'react';
import './Component.css';  // Assuming you have a CSS file for styling
import { useAuth } from '../AuthContext';

function SignupAthlete() {
    const { login } = useAuth();
    const [styles, setStyles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        birthDate: '',
        email: '',
        password: '',
        confirmPassword: '',
        styles: [],
    });

    useEffect(() => {
        fetch('https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/styles')
            .then(response => response.json())
            .then(data => setStyles(data))
            .catch(error => console.error('Error fetching styles:', error));
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleStyleChange = (event) => {
        const value = event.target.value;
        if (selectedStyles.includes(value)) {
            setSelectedStyles(selectedStyles.filter(styleId => styleId !== value));
        } else {
            setSelectedStyles([...selectedStyles, value]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (formData.password.length < 8) {
            alert('Password must be at least 8 characters!');
            return;
        }
        // Submit the form data along with selected styles
        registerAthlete();
    };

    const registerAthlete = async () => {
        // Implement the logic to send formData and selectedStyles to your backend
        const { firstName, lastName, username, birthDate, email, password } = formData;
        const styles = selectedStyles.map(styleId => ({ styleId }));
        const response = await fetch('https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/athlete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, username, birthDate, email, password, styles }),
        });

        const data = await response.json();

        if (response.ok) {
            login(data.athleteId);
            window.location.href = '/bouts';
        } else {
            setError(data.error);
        }
    };

    return (
        <div className="signup-container main-content">
            <h2>Join as an Athlete</h2>
            <form onSubmit={handleSubmit}>
                {/* Input fields for user information */}
                <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder="First Name" 
                    required 
                />
                <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder="Last Name" 
                    required 
                />
                <input 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="username" 
                    required 
                />
                <input 
                    name="birthDate" 
                    type="date" 
                    value={formData.birthDate} 
                    onChange={handleChange} 
                    placeholder="Birth Date" 
                    required 
                />
                <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email" r
                    equired /
                >
                <input 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                />
                <input 
                    name="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    placeholder="Confirm Password" 
                    required 
                />
                
                {/* Multi-select dropdown for styles */}
                <h2 className='available-style-title'>Select your competition styles</h2>
                <div className="style-list">
                    {styles?.map(style => (
                        <button
                    key={style.styleId}
                    className={`available-style ${selectedStyles.includes((style.styleId).toString()) ? 'selected' : ''}`}
                    onClick={handleStyleChange}
                    value={style.styleId}
                    >
                    {style.styleName}
                    </button>
                    ))}
                </div>
                {error && <div className="error-message">{error}</div>}
                <button className= "submit-athlete-signup" type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupAthlete;

