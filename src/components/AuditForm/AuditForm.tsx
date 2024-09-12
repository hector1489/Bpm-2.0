import { useState } from 'react';
import questions from '../../questions.json';

interface FormData {
  question: string;
  answer: string;
}

const sortQuestions = (data: any[]) => {
  return data
    .sort((a, b) => a.module.localeCompare(b.module))
    .map(module => {
      if (Array.isArray(module.question)) {
        module.question = module.question.sort((q1: any, q2: any) => {
          if (typeof q1 === 'object' && typeof q2 === 'object') {
            return q1.id - q2.id;
          } else if (typeof q1 === 'string' && typeof q2 === 'string') {
            return q1.localeCompare(q2);
          }
          return 0;
        });
      }
      return module;
    })
}

const AuditForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: ''
  })

  const sortedQuestions = sortQuestions(questions)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pregunta:
        <select
          name="question"
          value={formData.question}
          onChange={handleChange}
        >
          <option value="">Seleccione una pregunta</option>
          {sortedQuestions.map((q: { module: string; question: any }, index: number) => (
            <optgroup key={index} label={q.module}>
              {Array.isArray(q.question)
                ? q.question.map((item: any, i: number) => (
                  <option key={i} value={typeof item === 'object' ? item.question : item}>
                    {typeof item === 'object' ? item.question : item}
                  </option>
                ))
                : (
                  <option value={q.question}>
                    {q.question}
                  </option>
                )}
            </optgroup>
          ))}
        </select>
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
  )
}

export default AuditForm
