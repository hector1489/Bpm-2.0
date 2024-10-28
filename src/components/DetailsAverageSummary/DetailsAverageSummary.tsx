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

  const moduleGroups: Record<ModuleGroupName, string[]> = {
    BPM: ['infraestructura', 'legales'],
    POES: ['poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada', 
           'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 
           'poes-instalaciones'],
    POE: ['poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 
          'poe-mantencion', 'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 
          'poe-control-calidad', 'poe-ppt'],
    MA: ['MA'],
    DOC: ['doc'],
    TRA: ['poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion', 
          'poe-transporte', 'poe-servicio', 'doc'],
    LUM: ['LUM 21. Toma de muestra y uso de luminómetro'],
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

  const extractPercentage = (answer: string): number => {
    const match = answer.match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
  };
  

  const moduleData = useMemo(() => {
    return tablaDetails.map((detail) => ({
      moduleName: detail.field2,
      percentage: extractPercentage(detail.field4),
    }));
  }, [tablaDetails]);

  const calculateGroupAverage = useCallback(
    (modules: string[]): number => {
      const relevantModules = moduleData.filter((mod) => modules.includes(mod.moduleName));
      const totalPercentage = relevantModules.reduce((acc, curr) => acc + curr.percentage, 0);
      return relevantModules.length > 0 ? totalPercentage / relevantModules.length : 100;
    },
    [moduleData]
  );

  const groupedData = useMemo(() => {
    const unsortedData = Object.entries(moduleGroups).map(([groupName, modules]) => ({
      groupName: groupName as ModuleGroupName,
      average: calculateGroupAverage(modules as string[]).toFixed(2),
    }));

    const order: ModuleGroupName[] = ["BPM", "POES", "POE", "MA", "DOC", "TRA", "LUM"];
    return unsortedData.sort((a, b) => order.indexOf(a.groupName) - order.indexOf(b.groupName));
  }, [calculateGroupAverage]);

  const finalAverage = useMemo(() => {
    const totalPonderacion = Object.values(ponderaciones).reduce((acc, peso) => acc + peso, 0);
  
    const weightedSum = groupedData.reduce(
      (acc, group) => acc + (parseFloat(group.average) * ponderaciones[group.groupName as ModuleGroupName]) / totalPonderacion,
      0
    );
    
    return weightedSum.toFixed(2);
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
