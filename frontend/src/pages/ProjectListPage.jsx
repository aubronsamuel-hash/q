import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

// Page listing projects and allowing admins to create new ones
function ProjectListPage() {
  const { token, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');

  const loadProjects = async () => {
    try {
      const res = await apiFetch('/projects', {}, token);
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
          body: JSON.stringify({ name })
        },
        token
      );
      setName('');
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
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}

export default ProjectListPage;
