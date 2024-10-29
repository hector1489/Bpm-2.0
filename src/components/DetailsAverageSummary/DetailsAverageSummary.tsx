import './DetailsAverageSummary.css';
import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { questionsBPM, questionsPOES, questionsPOE, questionsMA, questionsDOC, questionsTra, questionLum } from '../../utils/ConstModules';

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

  const moduleQuestions: Record<ModuleGroupName, string[]> = {
    BPM: questionsBPM,
    POES: questionsPOES,
    POE: questionsPOE,
    MA: questionsMA,
    DOC: questionsDOC,
    LUM: questionLum,
    TRA: questionsTra,
  };

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

  const moduleData = useMemo(() => {
    return tablaDetails.map((detail) => ({
      moduleName: detail.field2,
      question: detail.field3,
      percentage: isNaN(parseFloat(detail.field4)) ? 0 : parseFloat(detail.field4),
    }));
  }, [tablaDetails]);

  const calculateGroupAverage = useCallback(
    (moduleName: ModuleGroupName): number => {
      const questions = moduleQuestions[moduleName];
      const relevantDetails = moduleData.filter(detail => questions.includes(detail.question) && detail.percentage > 0);

      const totalPercentage = relevantDetails.reduce((acc, curr) => acc + curr.percentage, 0);
      return relevantDetails.length > 0 ? totalPercentage / relevantDetails.length : 0;
    },
    [moduleData]
  );

  const groupedData = useMemo(() => {
    return Object.keys(moduleQuestions).map((groupName) => {
      const moduleName = groupName as ModuleGroupName;
      const average = calculateGroupAverage(moduleName);
      return {
        groupName: moduleName,
        average: average.toFixed(2),
        ponderacion: ponderaciones[moduleName],
      };
    });
  }, [calculateGroupAverage]);

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
