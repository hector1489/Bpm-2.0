// src/App.tsx
import React, { useState } from 'react';
import Home from './views/Home/Home';

const App: React.FC = () => {
  const [auditItems, setAuditItems] = useState<{ question: string; answer: string }[]>([]);

  const handleFormSubmit = (data: { question: string; answer: string }) => {
    setAuditItems([...auditItems, data]);
  };

  return (
    <div>
      <Home />
    </div>
  );
};

export default App;
