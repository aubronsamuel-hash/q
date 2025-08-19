import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewProjectForm from '../components/NewProjectForm';

// Page listing all projects for the logged in user
const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const { token, user } = useAuth();

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const res = await fetch('/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
      {user?.role === 'admin' && <NewProjectForm onCreated={fetchProjects} />}
    </div>
  );
};

export default ProjectListPage;
