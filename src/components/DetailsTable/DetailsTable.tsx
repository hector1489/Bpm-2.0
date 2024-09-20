import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import './DetailsTable.css';

const DetailsTable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  return (
    <table className="details-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Module</th>
          <th>Question</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        {state.IsHero.map((question) => {
          const currentModule = state.modules.find(module => {
            if (!module.question) {
              return false;
            }
            
            const moduleQuestions = Array.isArray(module.question) ? module.question : [module.question];
            const questionText = Array.isArray(question.question) ? question.question.join(' ') : question.question;

            return moduleQuestions.some(q => questionText.includes(q));
          });

          return (
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>{currentModule?.module || 'Unknown Module'}</td>
              <td>{question.question}</td>
              <td>{question.answer || 'No answer yet'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DetailsTable;
