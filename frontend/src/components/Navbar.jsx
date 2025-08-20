import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Simple navigation bar with logout button and title
function Navbar() {
  const navigate = useNavigate();
  const { token, setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear auth state and redirect to login
    setAuth({});
    navigate('/login');
  };

  return (
    <nav>
      <span>Project Manager</span>
      {token && <Link to="/projects">Projects</Link>}
      {token && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default Navbar;
