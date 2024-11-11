import './AverageTable.css';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
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
} from '../../utils/ConstModules'

const AverageTable: React.FC = () => {
  const { state } = useContext(AppContext) || {};

  if (!state) {
    return <div>Error: Context is not available.</div>;
  }

 
  const filterModuleDetails = (submoduleQuestions: string[]): number[] => {
  
    const filteredData = state.IsHero
      ? state.IsHero
          .filter((IQuestion) => submoduleQuestions.some(q => q === IQuestion.question))
          .map((IQuestion) => {
            const answer = IQuestion.answer?.trim() || '';
            const match = answer.match(/^(\d+(\.\d+)?)%/);
  
            if (match) {
              const numValue = parseFloat(match[1]);

              return !isNaN(numValue) ? numValue : NaN;
            }

           
            return NaN; 
          })
          .filter(value => !isNaN(value)) 
      : [];

    return filteredData;
  };
  


  const calculateGeneralAverage = (percentages: number[]) => {
    const validPercentages = percentages.filter(value => !isNaN(value));
    const total = validPercentages.reduce((acc, percentage) => acc + percentage, 0);
    return validPercentages.length > 0 ? (total / validPercentages.length).toFixed(2) : 'N/A';
  };


  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = filterModuleDetails(submoduleQuestions);
    return calculateGeneralAverage(submoduleData);
  };

  const calculateBPM = () => {
    const infraAverage = parseFloat(calculateSubmoduleAverage(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverage(legalesQuestions));

    const validAverages = [infraAverage, legalesAverage].filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  };

  const calculatePOES = () => {
    const poesAverages = [
      calculateSubmoduleAverage(poesControlProductosQuestion),
      calculateSubmoduleAverage(poesAguaQuestion),
      calculateSubmoduleAverage(poesSuperficiesQuestions),
      calculateSubmoduleAverage(poesContaminacionCruzadaQuestions),
      calculateSubmoduleAverage(poesSustanciasAdulterantes),
      calculateSubmoduleAverage(poesHigieneEmpleadosQuestions),
      calculateSubmoduleAverage(poesControlPlagas),
      calculateSubmoduleAverage(poesInstalacionesQuestions),
    ].map(avg => parseFloat(avg)).filter(avg => !isNaN(avg));

    const total = poesAverages.reduce((acc, avg) => acc + avg, 0);
    return poesAverages.length > 0 ? (total / poesAverages.length).toFixed(2) : 'N/A';
  };

  const calculatePOE = () => {
    const poeAverages = [
      calculateSubmoduleAverage(poeRecepcionQuestions),
      calculateSubmoduleAverage(poeAlamacenaminetoQuestions),
      calculateSubmoduleAverage(poePreelaboracionesQuestions),
      calculateSubmoduleAverage(poeElaboracionesQuestions),
      calculateSubmoduleAverage(poeTransporteQuestions),
      calculateSubmoduleAverage(poeServicioQuestions),
      calculateSubmoduleAverage(poeLavadoOllasQuestions),
      calculateSubmoduleAverage(poeControlCalidadQiestions),
      calculateSubmoduleAverage(poePptQuestions)
    ].map(avg => parseFloat(avg)).filter(avg => !isNaN(avg));

    const total = poeAverages.reduce((acc, avg) => acc + avg, 0);
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
    { groupName: 'LUM', aspectsEvaluated: 'TRAZADORES DE POSIBLE BROTE ETA', weighing: 21, average: calculateTRA() },
    { groupName: 'TRA', aspectsEvaluated: 'LUMINOMETRIA', weighing: 10, average: calculateLUM() },
  ];

  const finalAverage = useMemo(() => {
    const validAverages = groupedData.map(group => parseFloat(group.average)).filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  }, [groupedData]);



  const getRowClass = (average: number) => {
    if (average >= 90) return 'bg-success-light';
    if (average >= 75) return 'bg-warning-light';
    if (average >= 50) return 'bg-info-light';
    return 'bg-danger-light';
  };

  return (
    <div className="average-table">
      <div className="table-responsive">
        <table id="tabla-average" className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>MODULO</th>
              <th>PORCENTAJE (%)</th>
            </tr>
          </thead>
          <tbody id="average-table-body">
            {groupedData.map((group) => (
              <tr key={group.groupName} className={getRowClass(parseFloat(group.average))}>
                <td data-label="MODULO">{group.groupName}</td>
                <td data-label="PORCENTAJE (%)">{group.average}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot id="tfood-average-table">
            <tr className="bg-warning">
              <td data-label="PROMEDIO FINAL PONDERADO">PROMEDIO FINAL PONDERADO</td>
              <td data-label="PORCENTAJE (%)">{finalAverage}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AverageTable;
