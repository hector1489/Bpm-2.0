import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import './DetailsTable.css';
import { createTablaDetail } from '../../utils/apiDetails';
import { createAuditSheet } from '../../utils/apiAuditSheet';

const DetailsTable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const handleSendToBackend = async () => {
    const dataToSend = state.IsHero.map((question) => {
      const numeroAuditoria = state.auditSheetData.numeroAuditoria;
      const currentModule = state.modules.find(module => {
        if (!module.question) {
          return false;
        }
        const moduleQuestions = Array.isArray(module.question) ? module.question : [module.question];
        const questionText = Array.isArray(question.question) ? question.question.join(' ') : question.question;
        return moduleQuestions.some(q => questionText.includes(q));
      });

      if (!currentModule) {
        console.error('No se encontró el módulo correspondiente para la pregunta:', question);
        return null;
      }

      return {
        numero_auditoria: numeroAuditoria,
        columna1: question.id,
        columna2: currentModule.module || 'Unknown Module',
        columna3: question.question,
        columna4: question.answer || 'No answer yet'
      };
    }).filter(Boolean);


    try {
      await createTablaDetail(dataToSend);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const handleSendAuditSheetToBackend = async () => {
    try {
      // Verifica que los datos de auditoría existan en el estado
      if (!state.auditSheetData || !state.userName) {
        console.error('No se encontraron los datos de auditoría o el username.');
        return;
      }

      // Construir el objeto de datos para enviar al backend
      const dataToSendAuditSheet = {
        username: state.userName,
        numero_auditoria: state.auditSheetData.numeroAuditoria,
        field1: state.auditSheetData.nombreEstablecimiento,
        field2: state.auditSheetData.gerenteEstablecimiento,
        field3: state.auditSheetData.administradorEstablecimiento,
        field4: state.auditSheetData.supervisorEstablecimiento,
        field5: state.auditSheetData.auditorEmail,
        field6: state.auditSheetData.fechaAuditoria,
      };


      await createAuditSheet(dataToSendAuditSheet);
    } catch (error) {
      console.error('Error al enviar los datos de la auditoría al backend:', error);
    }
  };

  useEffect(() => {
    handleSendToBackend();
    handleSendAuditSheetToBackend();
  }, []);

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
          const currentModule = state.modules.find((module) => {
            if (!module.question) {
              return false;
            }

            const moduleQuestions = Array.isArray(module.question)
              ? module.question
              : [module.question];
            const questionText = Array.isArray(question.question)
              ? question.question.join(' ')
              : question.question;

            return moduleQuestions.some((q) => questionText.includes(q));
          });

          return (
            <tr key={question.id}>
              <td data-label="ID">{question.id}</td>
              <td data-label="Module">{currentModule?.module || 'Unknown Module'}</td>
              <td data-label="Question">{question.question}</td>
              <td data-label="Response">{question.answer || 'No answer yet'}</td>
            </tr>
          );
        })}
      </tbody>

    </table>
  );
};

export default DetailsTable;
