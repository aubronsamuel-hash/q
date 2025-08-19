import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';

// Main application component with routing
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <ProjectListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <RequireAuth>
                <ProjectDetailPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
