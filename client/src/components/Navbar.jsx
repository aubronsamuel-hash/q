import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple navigation bar displayed when the user is logged in
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/projects" style={{ marginRight: '1rem' }}>
        Projects
      </Link>
      <span style={{ marginRight: '1rem' }}>Hello, {user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
