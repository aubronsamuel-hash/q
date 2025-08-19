import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Simple navigation bar with logout button
function Navbar() {
  const navigate = useNavigate();
  const { token, setAuth } = useContext(AuthContext);

  if (!token) return null;

  const handleLogout = () => {
    // Clear auth state and redirect to login
    setAuth({});
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/projects">Projects</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
