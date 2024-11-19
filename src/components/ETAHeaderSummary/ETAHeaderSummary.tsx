import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getColorByPercentageFilas } from '../../utils/utils'

interface ETAHeaderSummaryProps {
  moduleData: {
    moduleName: string;
    percentage: number;
  }[];
}

const ETAHeaderSummary: React.FC<ETAHeaderSummaryProps> = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const { state } = context;
  const { auditSheetData } = state;

  const questionsEta = [
    "TRA CS 17. Aplicacion y eficiencia del programa de higiene, publicado e implementado por áreas (Art. 41, 43, 44, 64, 69):",
    "TRA CSH 29. Lavado y sanitizado correcto de manos y uñas:",
    "TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):",
    "TRA PRE 52. Verificar descongelación en equipos de refrigeración, en agua corriendo sólo en caso de emergencias:",
    "TRA ELB 60. Respetan las T° y los tiempos correctos de cocción y enfriamiento (fríos y calientes):",
    "TRA ELB 66. Tiempo entre elaboración y consumo:",
    "TRA MA 67. Control de tiempo y Tº del equipo, al inicio y término de la mantención en frío o caliente:",
    "TRA TPO 68. Traslado de alimentos cumpliendo; protección, rotulación, estiba y registros al inicio y término:",
    "TRA SER 72. Equipos suficientes para la correcta mantención de productos calientes y fríos:",
    "TRA DOC 98. Informes de auditoría sanitaria, plan de acción, verificación de cumplimiento, por Administrador:",
    "TRA DOC 99. Registros del cumplimiento al 100% del programa de charlas en Calidad y Medio Ambiente:",
  ];

  // Calcular etaData y nonApplicableQuestions
 // Eliminar esta sección si no la vas a usar
const { etaData } = useMemo(() => {
  const etaData = state.IsHero
    .filter((question) => questionsEta.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      let percentage = 0;

      if (answer !== 'N/A' && answer !== null) {
        const percentageMatch = answer.match(/^\d+/);
        percentage = percentageMatch ? parseInt(percentageMatch[0], 10) : 0;
      }

      const shortQuestionName = question.question.split('.')[0] + '.';

      return {
        question: question.question,
        shortQuestion: shortQuestionName,
        percentage,
        isNotApplicable: answer === 'N/A' || answer === null,
      };
    });

  return { etaData };
}, [state.IsHero]);


  const percentages = etaData.map((data) => data.percentage);

  // Calcular el promedio general
  const totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0);
  const validQuestionsCount = percentages.filter((percentage) => percentage !== 0).length;
  const averagePercentage = validQuestionsCount > 0 ? totalPercentage / validQuestionsCount : 0;

  const finalAverage = averagePercentage.toFixed(2);

  const finalAverageNumber = finalAverage !== 'N/A' ? parseFloat(finalAverage) : NaN;

  const backgroundColor = !isNaN(finalAverageNumber) ? getColorByPercentageFilas(finalAverageNumber) : 'gray';


  let textColor = 'black';
  if (backgroundColor === 'red') {
    textColor = 'white';
  } else if (backgroundColor === 'yellow') {
    textColor = 'black';
  } else if (backgroundColor === 'green') {
    textColor = 'white';
  }


  return (
    <div className="ficha-resumen-container">
      <div className="ficha-resumen-table">
        <table>
          <thead>
            <tr>
              <th>Nombre del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.nombreEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Número de Auditoría:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.numeroAuditoria || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Gerente del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.gerenteEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Administrador del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.administradorEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Supervisor del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.supervisorEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Auditor Email:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.auditorEmail || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Fecha:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.fechaAuditoria || 'N/A'}
                </span>
              </td>
            </tr>
          </thead>
        </table>
      </div>

      <div className="puntaje-ponderado">
        <h4 className="puntaje-promedio"  style={{ backgroundColor, color: textColor }}>
          Promedio General : <span id="promedio-general">{averagePercentage.toFixed(2)}%</span>
        </h4>
        <div className="indicadores">
          <div className="indicador cumple">
            CUMPLE 90% - 100%
          </div>
          <div className="indicador alerta">
            EN ALERTA 75% - 89%
          </div>
          <div className="indicador critico">
            CRÍTICO 0% - 74%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETAHeaderSummary;
