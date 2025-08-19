import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Component displaying a single task with controls for status and time logging
const TaskItem = ({ task, onStatusChange, onTimeLogged }) => {
  const { token, user } = useAuth();
  const [hours, setHours] = useState('');

  const canUpdate = user && (user.role === 'admin' || user.id === task.assignedUserId);

  // Mark the task as done
  const markDone = async () => {
    try {
      const res = await fetch(`/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'done' }),
      });
      if (res.ok) {
        onStatusChange();
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  // Log time for the task
  const logTime = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/tasks/${task.id}/timelogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hours: parseFloat(hours) }),
      });
      if (res.ok) {
        setHours('');
        onTimeLogged();
      }
    } catch (err) {
      console.error('Failed to log time', err);
    }
  };

  return (
    <li style={{ marginBottom: '0.5rem' }}>
      <strong>{task.title}</strong> - {task.status} - Assigned to {task.assignedUser?.name}
      {canUpdate && task.status !== 'done' && (
        <button onClick={markDone} style={{ marginLeft: '0.5rem' }}>
          Mark done
        </button>
      )}
      {canUpdate && (
        <form onSubmit={logTime} style={{ display: 'inline', marginLeft: '0.5rem' }}>
          <input
            type="number"
            step="0.1"
            placeholder="hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            style={{ width: '60px' }}
          />
          <button type="submit">Log time</button>
        </form>
      )}
    </li>
  );
};

export default TaskItem;
