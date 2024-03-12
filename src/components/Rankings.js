import React, { useState, useEffect } from 'react';
import './Component.css'; // Assuming this is your CSS file path

const Rankings = () => {
  const [rankingsData, setRankingsData] = useState([]);
  const [selectedStyleId, setSelectedStyleId] = useState(null);

  // Fetch rankings on component mount
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/rankings/styles');
        const rankings = await response.json();
        setRankingsData(rankings);
        // Default to the first style's ID
        if (rankings.length > 0) {
          setSelectedStyleId(rankings[0].styleId);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };
    fetchRankings();
  }, []);

  // Filter rankings for the selected style
  const selectedRankings = rankingsData?.find(ranking => ranking.styleId === selectedStyleId) || { ranking: [] };

  return (
    <div className="rankings-container main-content">
      <div className="styles-selector">
        {rankingsData?.map(style => (
          <button
            key={style.styleId}
            className={`style-button ${selectedStyleId === style.styleId ? 'selected' : ''}`}
            onClick={() => setSelectedStyleId(style.styleId)}
          >
            {style.style}
          </button>
        ))}
      </div>
      <div className="rankings-list">
        {selectedRankings?.ranking?.map((athlete, index) => (
          <div key={index} className="ranking-card">
            <h3>{index + 1}. {athlete.firstName} {athlete.lastName} ({athlete.username})</h3>
            <p>Wins: {athlete.wins}, Losses: {athlete.losses}, Score: {athlete.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rankings;
