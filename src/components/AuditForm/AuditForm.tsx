import { useState, useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import './AuditForm.css'
import { Answer } from '../../interfaces/interfaces'
import { useNavigate } from 'react-router-dom'

const AuditForm: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Answer[]>([]);
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Error: El contexto no está disponible.</div>;
  }

  const { state, addAnswers } = context;
  const currentQuestion = state.IsHero[currentQuestionIndex];

  const questionText = Array.isArray(currentQuestion?.question)
    ? currentQuestion.question.join(' ')
    : currentQuestion?.question || '';

  const currentModule = state.modules?.find(module => {
    if (!module.question) {
      return false;
    }

    const moduleQuestions = Array.isArray(module.question) ? module.question : [module.question];

    return moduleQuestions.some(q => questionText.includes(q));
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = [...formData];
    updatedFormData[currentQuestionIndex] = {
      question: currentQuestion?.question || '',
      answer: e.target.value,
    };
    setFormData(updatedFormData);
  };

  const handleNext = () => {
    const updatedFormData = [...formData];
    const selectedAnswer = updatedFormData[currentQuestionIndex]?.answer;

    if (!selectedAnswer) {
      const defaultAnswer = currentQuestion?.responses?.[0] || '';
      updatedFormData[currentQuestionIndex] = {
        question: currentQuestion?.question || '',
        answer: defaultAnswer,
      };
    }

    if (currentQuestionIndex < state.IsHero.length - 1) {
      setFormData(updatedFormData);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      addAnswers(updatedFormData);
      navigate('/resumen-auditoria');
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        {currentModule && (
          <h3>{currentModule.module}</h3>
        )}
        <label>
          Pregunta:
          <div>{currentQuestion ? currentQuestion.question : 'No hay más preguntas'}</div>
        </label>
        <label>
          Respuesta:
          <select
            name="answer"
            value={formData[currentQuestionIndex]?.answer || ''}
            onChange={handleChange}
          >
            <option value="">Seleccione una respuesta</option>
            {Array.isArray(currentQuestion?.responses) ? (
              currentQuestion.responses.map((response: string, index: number) => (
                <option key={index} value={response}>
                  {response}
                </option>
              ))
            ) : (
              <option value={currentQuestion?.responses || ''}>
                {currentQuestion?.responses || 'No hay respuestas'}
              </option>
            )}
          </select>
        </label>
        <div>
          <button type="button" onClick={handleNext}>
            {currentQuestionIndex < state.IsHero.length - 1 ? 'Siguiente' : 'Enviar'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AuditForm
