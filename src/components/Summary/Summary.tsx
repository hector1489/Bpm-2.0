import { useContext, useMemo } from 'react'
import './Summary.css'
import { AppContext } from '../../context/GlobalState'
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

const Summary: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const { state } = context;
  const { auditSheetData } = state;

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
    { groupName: 'BPM', average: calculateBPM() },
    { groupName: 'POES', average: calculatePOES() },
    { groupName: 'POE', average: calculatePOE() },
    { groupName: 'MA', average: calculateMA() },
    { groupName: 'DOC', average: calculateDOC() },
    { groupName: 'TRA', average: calculateTRA() },
    { groupName: 'LUM', average: calculateLUM() },
  ];

  
  const finalAverage = useMemo(() => {
    const validAverages = groupedData.map(group => parseFloat(group.average)).filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  }, [groupedData]);


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
        <h4 className="puntaje-promedio">
          Promedio General : <span id="promedio-general">{finalAverage}%</span>
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
  )
}

export default Summary
