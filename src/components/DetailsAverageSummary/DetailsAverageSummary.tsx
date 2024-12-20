import './DetailsAverageSummary.css';
import { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
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

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

type ModuleGroupName = 'BPM' | 'POES' | 'POE' | 'MA' | 'DOC' | 'LUM' | 'TRA';

interface DetailsAverageSummaryProps {
  numeroAuditoria: string | undefined;
}

const DetailsAverageSummary: React.FC<DetailsAverageSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context?.state) {
    return <div>Error al cargar el contexto</div>;
  }

  const ponderaciones: Record<ModuleGroupName, number> = {
    BPM: 4,
    POES: 25,
    POE: 25,
    MA: 4,
    DOC: 10,
    LUM: 10,
    TRA: 21
  };

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria) return;
      setLoading(true);
      setError(null);

      try {
        const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
        setTablaDetails(data);
      } catch (err) {
        setError('Error al obtener los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };

    fetchTablaDetails();
  }, [numeroAuditoria]);

  const filterModuleDetails = (questions: string[]) => {
    return tablaDetails
      .filter(detail => questions.includes(detail.field3))
      .filter((detail, index, self) =>
        index === self.findIndex(d => d.field3 === detail.field3)
      )
      .map(detail => {
        const value = detail.field4.replace('%', '');
        return isNaN(parseFloat(value)) ? NaN : parseFloat(value);
      })
      .filter(value => !isNaN(value));
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

  const groupedData = useMemo(() => [
    { groupName: 'BPM', average: calculateBPM(), ponderacion: ponderaciones['BPM'] },
    { groupName: 'POES', average: calculatePOES(), ponderacion: ponderaciones['POES'] },
    { groupName: 'POE', average: calculatePOE(), ponderacion: ponderaciones['POE'] },
    { groupName: 'MA', average: calculateMA(), ponderacion: ponderaciones['MA'] },
    { groupName: 'DOC', average: calculateDOC(), ponderacion: ponderaciones['DOC'] },
    { groupName: 'TRA', average: calculateTRA(), ponderacion: ponderaciones['TRA'] },
    { groupName: 'LUM', average: calculateLUM(), ponderacion: ponderaciones['LUM'] },
  ], [tablaDetails]);

  const finalAverage = useMemo(() => {
    const validAverages = groupedData.map(group => parseFloat(group.average)).filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  }, [groupedData]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="DetailsAverageSummary">
      <div className="table-detailDD-average">
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
                  <tr key={group.groupName}>
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
      </div>
    </div>
  );
};

export default DetailsAverageSummary;
