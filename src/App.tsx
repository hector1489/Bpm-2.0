// src/App.tsx
import React, { useState } from 'react';
import AuditForm from './components/AuditForm/AuditForm';
import AuditList from './components/AuditList/AuditList';

const App: React.FC = () => {
  const [auditItems, setAuditItems] = useState<{ question: string; answer: string }[]>([]);

  const handleFormSubmit = (data: { question: string; answer: string }) => {
    setAuditItems([...auditItems, data]);
  };

  return (
    <div>
      <h1>Auditoría</h1>
      <AuditForm  />
      <AuditList items={auditItems} />
    </div>
  );
};

export default App;
