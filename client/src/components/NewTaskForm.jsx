import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Form allowing an admin to create a new task for a project
const NewTaskForm = ({ projectId, onCreated }) => {
  const [title, setTitle] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const { token } = useAuth();

  // Submit new task to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, assignedUserId }),
      });
      if (res.ok) {
        setTitle('');
        setAssignedUserId('');
        onCreated();
      }
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h4>New Task</h4>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Assigned User ID"
        value={assignedUserId}
        onChange={(e) => setAssignedUserId(e.target.value)}
      />
      <br />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default NewTaskForm;
