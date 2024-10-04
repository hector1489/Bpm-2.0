import './ResumenForm.css';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

  const ETAQuestion = [
    {
      module: 'CONTROL DE SUPERFICIES CONTACTO CON ALIMENTOS E INSTALACIONES',
      questions: ['CS 19.', 'CS 20.'],
    },
    {
      module: 'CONTROL DE SALUD E HIGIENE DE EMPLEADOS',
      questions: ['CSH 32.'],
    },
    {
      module: 'CONTROL DE PLAGAS',
      questions: ['CP 35.', 'CP 36.'],
    },
    {
      module: 'RECEPCION',
      questions: ['REC 42.', 'REC 43.'],
    },
    {
      module: 'PROCESOS Y PRODUCTOS TERMINADOS',
      questions: ['PPT 82.', 'PPT 83.', 'PPT 84.', 'PPT 85.', 'PPT 86.', 'PPT 87.'],
    },
    {
      module: 'CAP - CAPACITACION',
      questions: ['CAP 101.', 'CAP 102.'],
    },
  ];

  

  const getAnswerForQuestion = (question: string) => {
    const foundQuestion = state.IsHero.find(q => q.question.startsWith(question));
    return foundQuestion ? foundQuestion.answer : 'Sin respuesta';
  };

  return (
    <div className="Resumen-form-container">
      <div className='resumen-form'>
        <h3>Resumen Auditoría</h3>
        <p>ETA</p>
        <table>
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {ETAQuestion.map((module) => 
              module.questions.map((question) => (
                <tr key={question}>
                  <td>{question}</td>
                  <td>{getAnswerForQuestion(question)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumenForm;
