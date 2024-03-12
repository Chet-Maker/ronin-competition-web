import React, { useEffect, useState } from 'react';
import Banner from './Banner';
import './Component.css'; // Importing your CSS file for styles

const Home = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getFullFeed');
        const data = await response.json();
        setFeed(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <Banner />
      <div>
        {feed.map((item, index) => (
          <div key={index} className="outcome-card">
            <div className="outcome-detail"><strong>{item.winnerFirstName} {item.winnerLastName} ({item.winnerScore}) vs {item.loserFirstName} {item.loserLastName} ({item.loserScore})</strong></div>
            <div className="outcome-detail">Style: {item.style}</div>
            <div className="outcome-detail">Winner: {item.winnerFirstName} {item.winnerLastName} ({item.winnerUsername})</div>
            <div className="outcome-detail">Loser: {item.loserFirstName} {item.loserLastName} ({item.loserUsername})</div>
            <div className="outcome-detail">Time: {new Date(item.updatedDt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
