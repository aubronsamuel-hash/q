import React from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Project {id}</h1>
      {/* TODO: show project details, tasks, and time logs */}
    </div>
  );
}

export default ProjectDetailPage;
