import { useState, useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import './AuditForm.css'
import { Answer } from '../../interfaces/interfaces'

const AuditForm: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [formData, setFormData] = useState<Answer[]>([])
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error: El contexto no está disponible.</div>
  }

  const { state, addAnswers } = context;
  const currentQuestion = state.IsHero[currentQuestionIndex];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = [...formData];
    updatedFormData[currentQuestionIndex] = {
      question: currentQuestion?.question || '',
      answer: e.target.value
    };
    setFormData(updatedFormData);
  }

  const handleNext = () => {
    if (currentQuestionIndex < state.IsHero.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnswers(formData);
    console.log('Respuestas guardadas:', formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Pregunta:
          <div>{currentQuestion ? currentQuestion.question : "No hay más preguntas"}</div>
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
          {currentQuestionIndex < state.IsHero.length - 1 && (
            <button type="button" onClick={handleNext}>
              Siguiente
            </button>
          )}
          <button type="submit">Enviar</button>
        </div>
      </div>
    </form>
  )
}

export default AuditForm
