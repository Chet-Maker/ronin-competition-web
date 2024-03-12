import React, { useState } from 'react';
import './Component.css';  // Importing the CSS file
import { useAuth } from '../AuthContext';

function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const response = await fetch('https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/authorize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            login(data.athlete.athlete_id);
            window.location.href = '/bouts';

        } else {
            setError(data.error);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Rōnin</h1>
            <p className="login-subtitle">Challenge All</p>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="input-field-login"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field-login"
            />
            {error && <div className="login-error">{error}</div>}
            <button onClick={handleLogin} className="login-button">Login</button>
            <p className="signup-link">Don't have an account? <a href="/signup">Sign up here</a></p>
        </div>
    );
}

export default Login;