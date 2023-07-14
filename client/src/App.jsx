import { useContext, useEffect, useRef } from 'react';
import Home from './pages/home/home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import { BrowserRouter as Router,Routes,Route ,redirect,} from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { axiosJWT } from './apiCalls';


function App() {
  const { user, dispatch } = useContext(AuthContext);  
  return (
    <Router>
      <Routes>
        <Route path="/" element={user?<Home />:<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={user?<Profile />:<Login/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App
