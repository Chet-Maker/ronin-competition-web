import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Component.css'; 

const Bouts = () => {
    const [athletes, setAthletes] = useState([]);
    const [searchOpponent, setSearchOpponent] = useState("");
    const [searchReferee, setSearchReferee] = useState("");
    const [opponent, setOpponent] = useState(null);
    const [referee, setReferee] = useState(null);
    const [styles, setStyles] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [pendingBouts, setPendingBouts] = useState(null);
    const [incompleteBouts, setIncompleteBouts] = useState(null);

  const athleteId = localStorage.getItem('athleteId');

  useEffect(() => {
    const fetchAthletesAndStyles = async () => {
      try {
        const athletesResponse = await axios.get("https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getAllAthletes");
        setAthletes(athletesResponse.data);

        const stylesResponse = await axios.get("https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/styles");
        setStyles(stylesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAthletesAndStyles();
  }, []);

  useEffect(() => {
    const fetchStyles = async () => {
      if (opponent) {
        const opponentId = opponent.athleteId;
        const response = await axios.get(
          `https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getCommonStyles/${opponentId}/${athleteId}`
        ).then((response) => {
          setStyles(response.data);
        })
    };
    fetchStyles();
  }}, [opponent]);

  // Handle fetching bouts specific to the logged-in athlete
  const fetchBouts = async () => {
    // You need to adjust the endpoints to match your API's bout fetching logic
    try {
      const pendingResponse = await axios.get(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getPendingBouts/${athleteId}`);
      setPendingBouts(pendingResponse.data);

      const incompleteResponse = await axios.get(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getIncompleteBouts/${athleteId}`);
      setIncompleteBouts(incompleteResponse.data);
    } catch (error) {
      console.error('Error fetching bouts:', error);
    }
  };

  const filteredAthletes = (searchValue) => {
    const ahletesFiltered = athletes.filter(
      (athlete) =>
        athlete?.athleteId !== athleteId &&
        (athlete.username.toLowerCase().includes(searchValue.toLowerCase()) ||
          athlete.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          athlete.lastName.toLowerCase().includes(searchValue.toLowerCase()))
    );
    return ahletesFiltered;
  };

  const handleOpponentSelect = (athlete) => {
    setOpponent(athlete);
    setSearchOpponent("");
  };

  const handleRefereeSelect = (athlete) => {
    setReferee(athlete);
    setSearchReferee("");
  };


  const acceptBout = async (boutId) => {
    try {
        const response = await axios.put(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/acceptBout/${boutId}`);
        if (response.status === 200) {
            fetchBouts(); // Refresh bout list after accepting a bout
        }
    } catch (error) {
        console.error('Error accepting bout:', error);
    }
    };

    const declineBout = async (boutId) => {
    try {
        const response = await axios.put(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/declineBout/${boutId}`);
        if (response.status === 200) {
            fetchBouts(); // Refresh bout list after declining a bout
        }
    } catch (error) {
        console.error('Error declining bout:', error);
    }
    };

    const completeBout = async (boutId, winnerId, loserId, styleId, isDraw) => {
    try {
        const response = await axios.put(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/completeBout/${boutId}`,
            {
                winner: winnerId,
                loser: loserId,
                style: styleId,
                draw: isDraw,
            }
    );
        if (response.status === 200) {
            fetchBouts(); // Refresh bout list after completing a bout
        }
    } catch (error) {
        console.error('Error completing bout:', error);
    }
    };

    const searchOpponents = (search) => {
    return athletes.filter(athlete => {
        const fullName = `${athlete.firstName} ${athlete.lastName}`;
        return fullName.toLowerCase().includes(search.toLowerCase());
    });
    };

    const handleCancelBout = async (boutId) => {
    try {
        const response = await axios.put(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/cancelBout/${boutId}/${athleteId}`);
        if (response.status === 200) {
            fetchBouts(); // Refresh bout list after cancelling a bout
        }
    } catch (error) {
        console.error('Error cancelling bout:', error);
    }
    }

  // Call fetchBouts when the component mounts or updates (e.g., athleteId changes)
  useEffect(() => {
    fetchBouts();
  }, []);

  // Function to handle creating a bout
  const createBout = async () => {
    if (!opponent || !referee || !selectedStyle) {
        console.error('Please select an opponent, a referee, and a style');
        return;
    }
    try {
      const response = await axios.post("https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/bout", {
        challengerId: athleteId, // This needs to be the logged-in athlete's ID
        acceptorId: opponent.athleteId,
        refereeId: referee.athleteId,
        styleId: selectedStyle.styleId,
        accepted: false,
        completed: false,
        cancelled: false,
      });
      if (response.status === 200) {
        setSearchOpponent(''); // Clear the search input
        setOpponent(null); // Clear the selected opponent
        setReferee(null); // Clear the selected referee
        setSelectedStyle(null); // Clear the selected style
        setStyles([]); // Clear the styles list (assuming it's a multi-select input)
        fetchBouts(); // Refresh bout list after creating a bout
      }
    } catch (error) {
      console.error('Error creating bout:', error);
    }
  };
  // Render the component
  return (
    <div className="challenge-screen-container main-content">
      <h1>Challenge</h1>
      {/* Dropdown for selecting styles */}
      <div className="select-style">
        <label htmlFor="style-select">Select Style:</label>
        <select
          id="style-select"
          value={selectedStyle ? selectedStyle.styleId : ''}
          onChange={(e) => {
            const style = styles.find(style => style.styleId === parseInt(e.target.value));
            setSelectedStyle(style);
          }}
        >
          {styles?.map((style) => (
            <option key={style.styleId} value={style.styleId}>
              {style.styleName}
            </option>
          ))}
        </select>
      </div>
      {/* Inputs and selection for opponent and referee */}
      {/* Simplified for demonstration, assuming functions for updating and selecting are implemented */}
      <div className="opponent-referee-selection">
        <input
          type="text"
          placeholder="Search opponent"
          value={searchOpponent}
          onChange={(e) => setSearchOpponent(e.target.value)}
        />
        {/* Display filtered opponents based on search, similar for referees */}
      </div>
        <div className="opponent-list">
            {searchOpponents(searchOpponent)?.map((athlete) => (
                <button key={athlete.athleteId} onClick={() => handleOpponentSelect(athlete)}>
                    {athlete.firstName} {athlete.lastName}
                </button>
            ))}
        </div>
      {/* Display selected opponent and referee */}
      {opponent && (
        <p>Selected Opponent: {opponent.firstName} {opponent.lastName}</p>
      )}
      <div className="opponent-referee-selection">
        <input
          type="text"
          placeholder="Search Referee"
          value={searchReferee}
          onChange={(e) => setSearchReferee(e.target.value)}
        />
        {/* Display filtered opponents based on search, similar for referees */}
      </div>
      <div className="opponent-list">
            {searchOpponents(searchOpponent)?.map((athlete) => (
                <button key={athlete.athleteId} onClick={() => handleRefereeSelect(athlete)}>
                    {athlete.firstName} {athlete.lastName}
                </button>
            ))}
        </div>
      {referee && (
        <p>Selected Referee: {referee.firstName} {referee.lastName}</p>
      )}
      {/* Button to create bout */}
      <button onClick={createBout}>Propose Bout</button>
      {/* List of pending bouts */}
      <div className="pending-bouts">
        <h2>Pending Bouts</h2>
        {pendingBouts?.map((bout, index) => (
          <div key={index} className="bout-card">
            <p>Bout vs. {bout.opponentName}</p>
            <button onClick={() => acceptBout(bout.boutId)}>Accept</button>
            <button onClick={() => declineBout(bout.boutId)}>Decline</button>
          </div>
        ))}
      </div>
      {/* List of incomplete bouts, awaiting actions */}
      <div className="incomplete-bouts">
        <h2>Incomplete Bouts</h2>
        {incompleteBouts?.map((bout, index) => (
          <div key={index} className="bout-card">
            <p>Bout vs. {bout.opponentName}, awaiting decision</p>
            {/* Assuming a role to complete bout, e.g., as referee */}
            <button onClick={() => completeBout(bout.boutId, true)}>Mark Complete</button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Bouts;
