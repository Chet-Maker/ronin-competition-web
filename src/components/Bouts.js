import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Component.css'; 

const Bouts = () => {
    const [athletes, setAthletes] = useState([]);
    const [athleteSearch, setAthleteSearch] = useState([]);
    const [searchOpponent, setSearchOpponent] = useState("");
    const [searchReferee, setSearchReferee] = useState("");
    const [opponent, setOpponent] = useState(null);
    const [referee, setReferee] = useState(null);
    const [styles, setStyles] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [pendingBouts, setPendingBouts] = useState(null);
    const [incompleteBouts, setIncompleteBouts] = useState(null);
    const [filteredAthletes, setFilteredAthletes] = useState([]);
    const [filteredReferees, setFilteredReferees] = useState([]);

  const athleteId = localStorage.getItem('athleteId');

  useEffect(() => {
    const fetchAthletesAndStyles = async () => {
      try {
        const athletesResponse = await axios.get("https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getAllAthletes");
        const fetchedAthletes = athletesResponse.data; // Assuming the data structure matches your expectations
        const athleteSearch = fetchedAthletes.map(athlete => `${athlete.firstName} ${athlete.lastName} (${athlete.username})`);
        setAthletes(fetchedAthletes);
        setAthleteSearch(athleteSearch);
        if (!opponent) {
            const stylesResponse = await axios.get("https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/styles");
            setStyles(stylesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAthletesAndStyles();
  }, []);

  useEffect(() => {
      if (opponent) {
        const opponentId = opponent.athleteId;
        console.log("Opponent id: " + opponentId + " and athlete Id: " + athleteId)
        const response = axios.get(
          `https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getCommonStyles/${opponentId}/${athleteId}`
        ).then((response) => {
          setStyles(response.data);
        })
    };
  }, [opponent]);

  const fetchBouts = async () => {
    try {
      const pendingResponse = await axios.get(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getPendingBouts/${athleteId}`);
      setPendingBouts(pendingResponse.data);
      const incompleteResponse = await axios.get(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/getIncompleteBouts/${athleteId}`);
      setIncompleteBouts(incompleteResponse.data);
    } catch (error) {
      console.error('Error fetching bouts:', error);
    }
  };

  useEffect(() => {
    const filter = searchOpponent ? athletes.filter((athlete) =>
      athlete.athleteId != athleteId &&
      (athlete.username.toLowerCase().includes(searchOpponent.toLowerCase()) ||
       athlete.firstName.toLowerCase().includes(searchOpponent.toLowerCase()) ||
       athlete.lastName.toLowerCase().includes(searchOpponent.toLowerCase()))
    ) : athletes;
    setFilteredAthletes(filter);
  }, [searchOpponent, athletes]);

  useEffect(() => {
    const filter = searchReferee ? athletes.filter((athlete) =>
      athlete.athleteId !== athleteId &&
      (athlete.username.toLowerCase().includes(searchReferee.toLowerCase()) ||
       athlete.firstName.toLowerCase().includes(searchReferee.toLowerCase()) ||
       athlete.lastName.toLowerCase().includes(searchReferee.toLowerCase()))
    ) : athletes;
    setFilteredReferees(filter);
  }, [searchReferee, athletes]);

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
        const response = await axios.post(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/createOutcome/${boutId}`,
            {
                winnerId: winnerId,
                loserId: loserId,
                styleId: styleId,
                isDraw: isDraw,
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

    const handleCancelBout = async (boutId, challengerId) => {
    try {
        const response = await axios.put(`https://2hkpzpjvfe.execute-api.us-east-1.amazonaws.com/develop/cancelBout/${boutId}/${challengerId}`);
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
        challengerId: athleteId, 
        acceptorId: opponent.athleteId,
        refereeId: referee.athleteId,
        styleId: selectedStyle.styleId,
        accepted: false,
        completed: false,
        cancelled: false,
      });
      if (response.status === 200) {
        setSearchOpponent(''); 
        setOpponent(null); 
        setReferee(null); 
        setSelectedStyle(null); 
        setStyles([]); 
        fetchBouts();
      }
    } catch (error) {
      console.error('Error creating bout:', error);
    }
  };
  // Render the component
  return (
    <div className="challenge-screen-container main-content">
        <div className="challenge-screen-container-1">
            <p className="challenge-title">Challenge</p>
            <div className="opponent-selection">
            <input
                type="text"
                value={searchOpponent}
                onChange={(e) => setSearchOpponent(e.target.value)}
                placeholder="Search opponent"
                className='search-opponent-input'
            />
            </div>
            {searchOpponent && (
                <div className="dropdown">
                {filteredAthletes.map((athlete) => (
                    <div
                    key={athlete.athleteId}
                    onClick={() => handleOpponentSelect(athlete)}
                    className="dropdown-item"
                    data-dropdown-item="true" 
                    >
                    {athlete.firstName} {athlete.lastName} ({athlete.username})
                    </div>
                ))}
                </div>
            )}
            {opponent && (
                <p className="selected-opponent">Selected Opponent: {opponent.firstName} {opponent.lastName}</p>
            )}
            <div className="referee-selection">
                <input
                type="text"
                placeholder="Search Referee"
                value={searchReferee}
                onChange={(e) => setSearchReferee(e.target.value)}
                className='search-referee-input'
                />
            </div>
            {searchReferee && (
                <div className="dropdown">
                {filteredReferees.map((athlete) => (
                    <div
                    key={athlete.athleteId}
                    onClick={() => handleRefereeSelect(athlete)}
                    className="dropdown-item"
                    >
                    {athlete.firstName} {athlete.lastName} ({athlete.username})
                    </div>
                ))}
                </div>
            )}
            {referee && (
                <p className="selected-referee">Selected Referee: {referee.firstName} {referee.lastName}</p>
            )}
            {opponent && referee ? (
                <div className="common-style-list">
                {styles?.length === 0 && (
                    <p>No common styles found with selected opponent</p>
                )}
                {styles?.map((style) => (
                    <button
                    key={style.styleId}
                    className={`common-style ${selectedStyle?.styleId === style.styleId ? 'selected' : ''}`}
                    onClick={() => setSelectedStyle(style)}
                    value={style.styleId}
                    >
                    {style.styleName}
                    </button>
                ))} </div>) : (
                <div className="no-styles-text">
                    <p>Select an opponent and referee to see available styles</p>
                </div>
                )}
                <button 
                    className="propose-bout-button"
                    onClick={createBout}>
                        Propose Bout
                </button>
        </div>
        <div className="challenge-screen-container-2">
        <div className="pending-bouts">
                {pendingBouts && <p className='pending-bout-title'>Pending Bouts</p>}
                {pendingBouts?.map((bout, index) => (
                <div key={index} className="bout-card">
                    {athleteId == bout.challengerId && (
                        <div>
                        <p>Awaiting Bout Acceptance</p>
                        <p>Bout: {bout.boutId}</p>
                        <p>vs. {bout.acceptorFirstName} {bout.acceptorLastName}</p>
                        <p>Referee: {bout.refereeFirstName} {bout.refereeLastName}</p>
                        <button className="cancel-bout" onClick={() => handleCancelBout(bout.boutId, bout.challengerId)}>Cancel</button>
                        </div>
                    )}
                    {athleteId == bout.acceptorId && (
                        <div>
                            <p>Bout: {bout.boutId}</p>
                            <p>vs. {bout.challengerFirstName} {bout.challengerLastName}</p>
                            <p>Referee: {bout.refereeFirstName} {bout.refereeLastName}</p>
                            <button className="accept-button" onClick={() => acceptBout(bout.boutId)}>Accept</button>
                            <button className="decline-button" onClick={() => declineBout(bout.boutId)}>Decline</button>
                        </div>
                    )}
                    {athleteId == bout.refereeId && (
                        <p>Awaiting Bout Acceptance</p>
                    )}
                </div>
                ))}
            </div>
        </div>
        <div className="challenge-screen-container-3">
            {/* List of incomplete bouts, awaiting actions */}
            <div className="incomplete-bouts">
                {incompleteBouts && <p className='incomplete-bout-title'>Incomplete Bouts</p>}
                {incompleteBouts?.map((bout, index) => (
                <div key={index} className="bout-card">
                    {/* Assuming a role to complete bout, e.g., as referee */}
                    {athleteId == bout.challengerId && (
                        <div>
                        <p>Bout: {bout.boutId}</p>
                        <p>Awaiting Outcome</p>
                        <p>vs. {bout.acceptorFirstName} {bout.acceptorLastName}</p>
                        <p>Referee: {bout.refereeFirstName} {bout.refereeLastName}</p>
                        <button className="cancel-bout" onClick={() => handleCancelBout(bout.boutId, bout.challengerId)}>Cancel</button>
                        </div>
                    )}
                    {athleteId == bout.acceptorId && (
                        <div>
                            <p>Bout: {bout.boutId}</p>
                            <p>Awaiting Outcome</p>
                            <p>{bout.acceptorFirstName} {bout.acceptorLastName} vs. {bout.challengerFirstName} {bout.challengerLastName}</p>
                            <p>Referee: {bout.refereeFirstName} {bout.refereeLastName}</p>
                            <button className="cancel-bout" onClick={() => handleCancelBout(bout.boutId, bout.challengerId)}>Cancel</button>
                        </div>
                    )}
                    {athleteId == bout.refereeId && (
                        <div>
                            Winner:
                            <div> 
                            <button className="decision-athlete" onClick={() => completeBout(bout.boutId, bout.challengerId, bout.acceptorId, bout.styleId, false)}>{bout.challengerFirstName} {bout.challengerLastName}</button>
                            <button className="decision-athlete" onClick={() => completeBout(bout.boutId, bout.acceptorId, bout.challengerId, bout.styleId, false)}>{bout.acceptorFirstName} {bout.acceptorLastName}</button>
                            </div>
                            <div>
                            <button className="decision-athlete" onClick={() => completeBout(bout.boutId, bout.challengerId, bout.acceptorId, bout.styleId, true)}>Draw</button>
                            </div>
                            <div>
                            <button className="decision-athlete" onClick={() => handleCancelBout(bout.boutId, bout.challengerId)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                ))}
            </div>
        </div>
    </div>
  );
  
};

export default Bouts;
