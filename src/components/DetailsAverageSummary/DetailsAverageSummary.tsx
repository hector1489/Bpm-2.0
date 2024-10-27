import './DetailsAverageSummary.css';
import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

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

  // Fetch tabla details
  const fetchTablaDetails = useCallback(async () => {
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
  }, [numeroAuditoria]);

  useEffect(() => {
    fetchTablaDetails();
  }, [fetchTablaDetails]);

  // Helper function to extract percentage from answer string
  const extractPercentage = (answer: string): number => {
    const match = answer.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Prepare module data
  const moduleData = useMemo(() => {
    return tablaDetails.map((detail) => ({
      moduleName: detail.field2,
      percentage: extractPercentage(detail.field4),
    }));
  }, [tablaDetails]);

  // Calculate average for a group of modules
  const calculateGroupAverage = useCallback((modules: string[]): number => {
    const relevantModules = moduleData.filter((mod) => modules.includes(mod.moduleName));
    const totalPercentage = relevantModules.reduce((acc, curr) => acc + curr.percentage, 0);
    return relevantModules.length > 0 ? totalPercentage / relevantModules.length : 100;
  }, [moduleData]);

  // Define module groups
  const moduleGroups = {
    BPM: ['infraestructura', 'legales'],
    POES: [
      'poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada',
      'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'
    ],
    POE: [
      'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
      'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
    ],
    MA: ['MA'],
    DOC: ['doc'],
    TRA: [
      'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
      'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
    ],
    LUM: ['poes-superficies']
  };

  // Prepare the grouped data with memoization
  // Prepare the grouped data with memoization
const groupedData = useMemo(() => {
  const unsortedData = Object.entries(moduleGroups).map(([groupName, modules]) => ({
    groupName,
    average: calculateGroupAverage(modules).toFixed(2),
  }));
  
  // Define the desired order
  const order = ["BPM", "POES", "POE", "MA", "DOC", "TRA", "LUM"];
  
  // Sort the data based on the predefined order
  return unsortedData.sort((a, b) => order.indexOf(a.groupName) - order.indexOf(b.groupName));
}, [calculateGroupAverage]);


  // Final average of all groups
  const finalAverage = useMemo(() => {
    const totalPercentage = groupedData.reduce((acc, group) => acc + parseFloat(group.average), 0);
    return (totalPercentage / groupedData.length).toFixed(2);
  }, [groupedData]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
