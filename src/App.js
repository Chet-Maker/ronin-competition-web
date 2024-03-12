import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Banner from './components/Banner';
import Events from './components/Events';
import Athletes from './components/Athletes';
import Rankings from './components/Rankings';
import Bouts from './components/Bouts';
import SignupGym from './components/SignupGym';
import SignupReferee from './components/SignupReferee';
import SignupAthlete from './components/SignupAthlete';
import Profile from './components/Profile';
import { useAuth } from './AuthContext';


function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <Banner />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate replace to="/home" /> : <Login authenticate={isLoggedIn} />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/join/gym" element={<SignupGym />} />
        <Route path="/join/referee" element={<SignupReferee />} />
        <Route path="/join/athlete" element={<SignupAthlete />} />
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/bouts" element={<Bouts />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;