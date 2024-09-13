import { useState } from 'react';
import questions from '../../questionsResponses.json';
import './AuditForm.css'

interface FormData {
  question: string;
  answer: string;
}

const AuditForm: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData[]>([]);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = [...formData];
    updatedFormData[currentQuestionIndex] = {
      question: currentQuestion.question,
      answer: e.target.value
    };
    setFormData(updatedFormData);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Pregunta:
          <div>
            {currentQuestion ? currentQuestion.question : "No hay más preguntas"}
          </div>
        </label>
        <label>
          Respuesta:
          <select
            name="answer"
            value={formData[currentQuestionIndex]?.answer || ''}
            onChange={handleChange}
          >
            <option value="">Seleccione una respuesta</option>
            {currentQuestion?.responses.map((response, index) => (
              <option key={index} value={response}>
                {response}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button type="button" onClick={handleNext}>
            Siguiente
          </button>
          <button type="submit">
            Enviar
          </button>
        </div>
      </div>
    </form>
  );
};

export default AuditForm;
