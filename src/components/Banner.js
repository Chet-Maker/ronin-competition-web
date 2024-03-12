import React from 'react';
import { Link } from 'react-router-dom';
// import roninLogo from '../ronin.png';
import './Component.css'; // Import CSS
import { useAuth } from '../AuthContext';

const Banner = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="banner">
      <div className="banner-title">
        <span className="banner-title-text">Rōnin</span>
    </div>
      <div>
        {/* <Link to="/events" className="banner-link">Events</Link> */}
        {/* <Link to="/athletes" className="banner-link">Athletes</Link> */}
        {/* <Link to="/rankings" className="banner-link">Rankings</Link>
        <Link to="/bouts" className="banner-link">Bouts</Link> */}
      </div>

      <div className = "right-options">
      <Link to="/rankings" className="banner-link">Rankings</Link>
        <Link to="/bouts" className="banner-link">Bouts</Link>
        {isLoggedIn ? (
          <Link to="/profile" className="banner-link">My Profile</Link>
        )
           : (
            <>
          <div className="banner-dropdown">
            Join
          <div className="dropdown-content">
            <Link to="/join/gym">Gym</Link>
            <Link to="/join/referee">Referee</Link>
            <Link to="/join/athlete">Athlete</Link>
          </div>
        </div>
          <Link to="/login" className="banner-link">Login</Link>
        </>)}
      </div>

    </div>
  );
};

export default Banner;
