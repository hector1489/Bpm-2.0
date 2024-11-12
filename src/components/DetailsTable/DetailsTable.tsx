import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import './DetailsTable.css';
import {
  questionsMA,
  questionsDOC,
  questionsTra,
  questionLum,
  infraestructuraQuestions,
  legalesQuestions,
  poesControlProductosQuestion,
  poesAguaQuestion,
  poesSuperficiesQuestions,
  poesContaminacionCruzadaQuestions,
  poesSustanciasAdulterantes,
  poesHigieneEmpleadosQuestions,
  poesControlPlagas,
  poesInstalacionesQuestions,
  poeRecepcionQuestions,
  poeAlamacenaminetoQuestions,
  poePreelaboracionesQuestions,
  poeElaboracionesQuestions,
  poeTransporteQuestions,
  poeServicioQuestions,
  poeLavadoOllasQuestions,
  poeControlCalidadQiestions,
  poePptQuestions,
} from '../../utils/ConstModules';

const DetailsTable: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  // Función para filtrar las preguntas de un módulo y devolver los porcentajes de respuesta
  const filterModuleDetails = (submoduleQuestions: string[]): number[] => {
    return state.IsHero
      ? state.IsHero
          .filter((IQuestion) => submoduleQuestions.some(q => q === IQuestion.question))
          .map((IQuestion) => {
            const answer = IQuestion.answer?.trim() || '';
            const match = answer.match(/^(\d+(\.\d+)?)%/);
            return match ? parseFloat(match[1]) : NaN;
          })
          .filter(value => !isNaN(value))
      : [];
  };

  // Función para calcular el promedio general de un módulo
  const calculateGeneralAverage = (percentages: number[]) => {
    const total = percentages.reduce((acc, percentage) => acc + percentage, 0);
    return percentages.length > 0 ? (total / percentages.length).toFixed(2) : 'N/A';
  };

  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = filterModuleDetails(submoduleQuestions);
    return calculateGeneralAverage(submoduleData);
  };

  // Funciones para calcular los promedios de cada módulo
  const calculateBPM = () => {
    const infraAverage = parseFloat(calculateSubmoduleAverage(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverage(legalesQuestions));
    const validAverages = [infraAverage, legalesAverage].filter(avg => !isNaN(avg));
    return validAverages.length > 0 ? (validAverages.reduce((acc, avg) => acc + avg, 0) / validAverages.length).toFixed(2) : 'N/A';
  };

  const calculatePOES = () => {
    const poesAverages = [
      poesControlProductosQuestion,
      poesAguaQuestion,
      poesSuperficiesQuestions,
      poesContaminacionCruzadaQuestions,
      poesSustanciasAdulterantes,
      poesHigieneEmpleadosQuestions,
      poesControlPlagas,
      poesInstalacionesQuestions,
    ].map(calculateSubmoduleAverage);

    const total = poesAverages.reduce((acc, avg) => acc + parseFloat(avg), 0);
    return poesAverages.length > 0 ? (total / poesAverages.length).toFixed(2) : 'N/A';
  };

  const calculatePOE = () => {
    const poeAverages = [
      poeRecepcionQuestions,
      poeAlamacenaminetoQuestions,
      poePreelaboracionesQuestions,
      poeElaboracionesQuestions,
      poeTransporteQuestions,
      poeServicioQuestions,
      poeLavadoOllasQuestions,
      poeControlCalidadQiestions,
      poePptQuestions,
    ].map(calculateSubmoduleAverage);

    const total = poeAverages.reduce((acc, avg) => acc + parseFloat(avg), 0);
    return poeAverages.length > 0 ? (total / poeAverages.length).toFixed(2) : 'N/A';
  };

  const calculateMA = () => calculateGeneralAverage(filterModuleDetails(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleDetails(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleDetails(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleDetails(questionsTra));

  const groupedData = [
    { groupName: 'BPM', aspectsEvaluated: 'INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES', weighing: 4, average: calculateBPM() },
    { groupName: 'POES', aspectsEvaluated: 'PROCEDIMIENTOS OP. DE SANITIZACION', weighing: 25, average: calculatePOES() },
    { groupName: 'POE', aspectsEvaluated: 'PROCEDIMIENTOS OP. DEL PROCESO', weighing: 25, average: calculatePOE() },
    { groupName: 'MA', aspectsEvaluated: 'MANEJO AMBIENTAL', weighing: 4, average: calculateMA() },
    { groupName: 'DOC', aspectsEvaluated: 'DOCUMENTACION', weighing: 10, average: calculateDOC() },
    { groupName: 'LUM', aspectsEvaluated: 'TRAZADORES DE POSIBLE BROTE ETA', weighing: 21, average: calculateLUM() },
    { groupName: 'TRA', aspectsEvaluated: 'LUMINOMETRIA', weighing: 10, average: calculateTRA() },
  ];

  const finalAverage = useMemo(() => {
    const validAverages = groupedData.map(group => parseFloat(group.average)).filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  }, [groupedData]);

  const submoduleOrder: Record<string, string[][]> = {
    BPM: [infraestructuraQuestions, legalesQuestions],
    POES: [
      poesControlProductosQuestion,
      poesAguaQuestion,
      poesSuperficiesQuestions,
      poesContaminacionCruzadaQuestions,
      poesSustanciasAdulterantes,
      poesHigieneEmpleadosQuestions,
      poesControlPlagas,
      poesInstalacionesQuestions,
    ],
    POE: [
      poeRecepcionQuestions,
      poeAlamacenaminetoQuestions,
      poePreelaboracionesQuestions,
      poeElaboracionesQuestions,
      poeTransporteQuestions,
      poeServicioQuestions,
      poeLavadoOllasQuestions,
      poeControlCalidadQiestions,
      poePptQuestions,
    ],
    MA: [questionsMA],
    DOC: [questionsDOC],
    TRA: [questionsTra],
    LUM: [questionLum],
  };

  return (
    <div className="details-table">
      <div className="table-summary">
        {groupedData.map((group) => (
          <div key={group.groupName} className="table-summary-section">
            <h3>{group.groupName}</h3>
            <table className='details-table-dt'>
              <thead>
                <tr>
                  <th>Modulo</th>
                  <th>Pregunta</th>
                  <th>Desviacion</th>
                </tr>
              </thead>
              <tbody>
                {submoduleOrder[group.groupName]?.map((submoduleQuestions) => (
                  submoduleQuestions.map((question, idx) => {
                    const answer = state.IsHero.find(q => q.question === question)?.answer || 'No answer yet';
                    return (
                      <tr key={idx}>
                        {idx === 0 ? <td rowSpan={submoduleQuestions.length}>{group.groupName}</td> : null}
                        <td>{question}</td>
                        <td>{answer}</td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
            <div className="table-summary-average">
              <strong>promedio para {group.groupName} : </strong>
              <span>{group.average}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="table-summary-final-average">
        <strong>Promedio Final : </strong>
        <span>{finalAverage}</span>
      </div>
    </div>
  );
};

export default DetailsTable;
