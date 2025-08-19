import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Form allowing an admin to create a new project
const NewProjectForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { token } = useAuth();

  // Submit new project to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName('');
        setDescription('');
        onCreated();
      }
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h3>New Project</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

export default NewProjectForm;
