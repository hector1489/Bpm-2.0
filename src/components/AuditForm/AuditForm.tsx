import React, { useState } from 'react';

interface FormData {
  question: string;
  answer: string;
}

const AuditForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pregunta:
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={handleChange}
        />
      </label>
      <label>
        Respuesta:
        <input
          type="text"
          name="answer"
          value={formData.answer}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default AuditForm;
