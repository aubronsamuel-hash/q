import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';

// Project detail with tasks, milestones and cost summary
function ProjectDetailPage() {
  const { id } = useParams();
  const { token, user, logout } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [cost, setCost] = useState({ totalHours: 0, totalCost: 0 });
  const [timeEntry, setTimeEntry] = useState({});

  const loadData = async () => {
    try {
      const resProj = await apiFetch(`/projects/${id}`, {}, token, logout);
      const projData = await resProj.json();
      setProject(projData);
      const resCost = await apiFetch(`/projects/${id}/cost`, {}, token, logout);
      const costData = await resCost.json();
      setCost(costData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateStatus = async (taskId, status) => {
    try {
      await apiFetch(
        `/tasks/${taskId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        },
        token,
        logout
      );
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const logTime = async (taskId) => {
    try {
      const entry = timeEntry[taskId] || {};
      await apiFetch(
        `/tasks/${taskId}/timelogs`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hours: entry.hours, date: entry.date })
        },
        token,
        logout
      );
      setTimeEntry({ ...timeEntry, [taskId]: { hours: '', date: '' } });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>
        Total Hours: {cost.totalHours} | Total Cost: {cost.totalCost}
      </p>

      <h2>Milestones</h2>
      <ul>
        {project.Milestones?.map((m) => (
          <li key={m.id}>{m.name}</li>
        ))}
      </ul>

      <h2>Tasks</h2>
      <ul>
        {project.Tasks?.map((t) => (
          <li key={t.id}>
            {t.title} - {t.status}
            {user && user.id === t.assignedUserId && (
              <div>
                <button onClick={() => updateStatus(t.id, 'in_progress')}>In Progress</button>
                <button onClick={() => updateStatus(t.id, 'done')}>Done</button>
                <div>
                  <input
                    type="number"
                    placeholder="Hours"
                    value={timeEntry[t.id]?.hours || ''}
                    onChange={(e) =>
                      setTimeEntry({
                        ...timeEntry,
                        [t.id]: { ...timeEntry[t.id], hours: e.target.value }
                      })
                    }
                  />
                  <input
                    type="date"
                    value={timeEntry[t.id]?.date || ''}
                    onChange={(e) =>
                      setTimeEntry({
                        ...timeEntry,
                        [t.id]: { ...timeEntry[t.id], date: e.target.value }
                      })
                    }
                  />
                  <button onClick={() => logTime(t.id)}>Log</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetailPage;
