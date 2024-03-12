import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProfileScreen = ({ setLoggedIn }) => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    
    // Assuming athleteId is stored in local storage or context API
    const athleteId = localStorage.getItem('athleteId');

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/profile/athlete/${athleteId}`);
            const data = await response.json();
            setProfile(data);
        };

        fetchProfile();
    }, [athleteId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="athlete-scores">
                <h3>Scores and Records by Style:</h3>
                {profile.athleteRecords.map(record => (
                    <div key={record.style_id}>
                        <p>Style: {record.style_name}</p>
                        <p>Wins: {record.wins}</p>
                        <p>Losses: {record.losses}</p>
                        <p>Draws: {record.draws}</p>
                        <p>Score: {profile.athleteScores.find(score => score.style_id === record.style_id).score}</p>
                    </div>
                ))}
            </div>
            <div className="athlete-info">
                <h3>Athlete Information:</h3>
                <p>Username: {profile.athleteInfo.username}</p>
                <p>First Name: {profile.athleteInfo.first_name}</p>
                <p>Last Name: {profile.athleteInfo.last_name}</p>
                <p>Email: {profile.athleteInfo.email}</p>
                <p>Birth Date: {new Date(profile.athleteInfo.birth_date).toLocaleDateString()}</p>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProfileScreen;
