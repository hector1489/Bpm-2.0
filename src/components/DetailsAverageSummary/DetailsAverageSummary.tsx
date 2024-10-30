import './DetailsAverageSummary.css';
import { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { questionsPOES, questionsPOE, questionsMA, questionsDOC, questionsTra, questionLum, infraestructuraQuestions, legalesQuestions } from '../../utils/ConstModules';

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

  // Filter for each module
  const filterModuleDetails = (questions: string[]) => {
    return tablaDetails
      .filter(detail => questions.includes(detail.field3))
      .filter((detail, index, self) =>
        index === self.findIndex(d => d.field3 === detail.field3)
      )
      .map(detail => parseFloat(detail.field4.replace('%', '')) || 0);
  };

  // Individual module calculations
  const calculateGeneralAverage = (percentages: number[]) => {
    const total = percentages.reduce((acc, percentage) => acc + percentage, 0);
    return percentages.length > 0 ? (total / percentages.length).toFixed(2) : 'N/A';
  };

  // Función para filtrar y calcular el promedio de un submódulo específico
  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = tablaDetails
      .filter(detail => submoduleQuestions.includes(detail.field3))
      .map(detail => parseFloat(detail.field4.replace('%', '')) || 0);

    const total = submoduleData.reduce((acc, percentage) => acc + percentage, 0);
    return submoduleData.length > 0 ? (total / submoduleData.length).toFixed(2) : 'N/A';
  };


  // Module-specific data extraction and average calculations
  const calculateBPM = () => {
    const infraAverage = parseFloat(calculateSubmoduleAverage(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverage(legalesQuestions));

    return ((infraAverage + legalesAverage) / 2).toFixed(2);
  };
  const calculatePOES = () => calculateGeneralAverage(filterModuleDetails(questionsPOES));
  const calculatePOE = () => calculateGeneralAverage(filterModuleDetails(questionsPOE));
  const calculateMA = () => calculateGeneralAverage(filterModuleDetails(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleDetails(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleDetails(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleDetails(questionsTra));

  const groupedData = useMemo(() => {
    return [
      { groupName: 'BPM', average: calculateBPM(), ponderacion: ponderaciones['BPM'] },
      { groupName: 'POES', average: calculatePOES(), ponderacion: ponderaciones['POES'] },
      { groupName: 'POE', average: calculatePOE(), ponderacion: ponderaciones['POE'] },
      { groupName: 'MA', average: calculateMA(), ponderacion: ponderaciones['MA'] },
      { groupName: 'DOC', average: calculateDOC(), ponderacion: ponderaciones['DOC'] },
      { groupName: 'TRA', average: calculateTRA(), ponderacion: ponderaciones['TRA'] },
      { groupName: 'LUM', average: calculateLUM(), ponderacion: ponderaciones['LUM'] },
    ];
  }, [tablaDetails]);

  const finalAverage = useMemo(() => {
    const weightedSum = groupedData
      .filter(group => group.groupName !== 'TRA' && group.groupName !== 'LUM')
      .reduce((acc, group) => acc + parseFloat(group.average) * group.ponderacion, 0);

    const totalWeight = Object.keys(ponderaciones)
      .filter(key => key !== 'TRA' && key !== 'LUM')
      .reduce((acc, key) => acc + ponderaciones[key as ModuleGroupName], 0);

    return (weightedSum / totalWeight).toFixed(2);
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
