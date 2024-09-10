import React from 'react';

interface AuditItem {
  question: string;
  answer: string;
}

interface AuditListProps {
  items: AuditItem[];
}

const AuditList: React.FC<AuditListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <strong>{item.question}:</strong> {item.answer}
        </li>
      ))}
    </ul>
  );
};

export default AuditList;
