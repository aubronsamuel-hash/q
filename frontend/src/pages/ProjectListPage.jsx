import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

// Page listing projects and allowing admins to create new ones
function ProjectListPage() {
  const { token, user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadProjects = async () => {
    try {
      const res = await apiFetch('/projects', {}, token, logout);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(
        '/projects',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description })
        },
        token,
        logout
      );
      setName('');
      setDescription('');
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
      {user?.role === 'admin' && (
        <form onSubmit={handleCreate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            data-testid="new-project-name"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            data-testid="new-project-description"
          />
          <button type="submit" data-testid="create-project-btn">Create</button>
        </form>
      )}
    </div>
  );
}

export default ProjectListPage;
