import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskItem from '../components/TaskItem';
import NewTaskForm from '../components/NewTaskForm';

// Page displaying details for a single project including tasks and milestones
const ProjectDetailPage = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [project, setProject] = useState(null);
  const [cost, setCost] = useState(null);

  // Fetch project details from API
  const fetchProject = async () => {
    try {
      const res = await fetch(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch (err) {
      console.error('Failed to fetch project', err);
    }
  };

  // Fetch project cost (total hours and cost)
  const fetchCost = async () => {
    try {
      const res = await fetch(`/projects/${id}/cost`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCost(data);
      }
    } catch (err) {
      console.error('Failed to fetch cost', err);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchCost();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      {cost && (
        <p>
          Total hours: {cost.totalHours}h, Total cost: {cost.totalCost}€
        </p>
      )}

      <h3>Tasks</h3>
      <ul>
        {project.tasks?.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onStatusChange={fetchProject}
            onTimeLogged={fetchCost}
          />
        ))}
      </ul>
      {user?.role === 'admin' && (
        <NewTaskForm projectId={id} onCreated={() => { fetchProject(); fetchCost(); }} />
      )}

      {project.milestones?.length > 0 && (
        <div>
          <h3>Milestones</h3>
          <ul>
            {project.milestones.map((m) => (
              <li key={m.id}>
                {m.title} - {m.dueDate}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
