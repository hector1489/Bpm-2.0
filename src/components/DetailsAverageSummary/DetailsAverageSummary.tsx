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
    POES: ['poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada', 'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'],
    POE: ['poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion', 'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'],
    MA: ['MA'],
    DOC: ['doc'],
    LUM: ['LUM 21. Toma de muestra y uso de luminómetro'],
    TRA: [
      'TRA CS 17. Aplicacion y eficiencia del programa de higiene, publicado e implementado por áreas (Art. 41, 43, 44, 64, 69):',
      'TRA TPO 68. Traslado de alimentos cumpliendo; protección, rotulación, estiba y registros al inicio y término:',
      'TRA DOC 98. Informes de auditoría sanitaria, plan de acción, verificación de cumplimiento, por Administrador:',
      'TRA CSH 29. Lavado y sanitizado correcto de manos y uñas:',
      'TRA DOC 99. Registros del cumplimiento al 100% del programa de charlas en Calidad y Medio Ambiente:',
      'TRA ELB 60. Respetan las T° y los tiempos correctos de cocción y enfriamiento (fríos y calientes):',
      'TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):',
      'TRA PRE 52. Verificar descongelación en equipos de refrigeración, en agua corriendo sólo en caso de emergencias:',
      'TRA SER 72. Equipos suficientes para la correcta mantención de productos calientes y fríos:',
      'TRA MA 67. Control de tiempo y Tº del equipo, al inicio y término de la mantención en frío o caliente:',
      'TRA ELB 66. Tiempo entre elaboración y consumo'
    ]
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
      field3: detail.field3,
      percentage: isNaN(parseFloat(detail.field4)) ? 0 : parseFloat(detail.field4),
    }));
  }, [tablaDetails])

  const calculateGroupAverage = useCallback(
    (modules: string[], specificModule?: ModuleGroupName): number => {
      const relevantModules = moduleData.filter((mod) => {
        if (specificModule === 'LUM' || specificModule === 'TRA') {
          const specificQuestions = moduleGroups[specificModule];
          return modules.includes(mod.moduleName) && specificQuestions.includes(mod.field3) && mod.percentage > 0;
        }
        return modules.includes(mod.moduleName) && mod.percentage > 0;
      });

      const totalPercentage = relevantModules.reduce((acc, curr) => acc + curr.percentage, 0);
      return relevantModules.length > 0 ? totalPercentage / relevantModules.length : 0;
    },
    [moduleData]
  );

  const nombreCompletoPorGrupo: Record<ModuleGroupName, string> = {
    BPM: 'Buenas Prácticas de Manufactura',
    POES: 'Procedimientos Operacionales Estandarizados de Saneamiento',
    POE: 'Procedimientos Operacionales Estandarizados',
    MA: 'Medio Ambiente',
    DOC: 'Documentación',
    TRA: 'Transporte',
    LUM: 'Luminometría',
  };

  // question modules
  const questionsTra = [
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

  const questionLum = ['LUM 21. Toma de muestra y uso de luminómetro:']



  const matchedDetailsForQuestionsTRA = tablaDetails
    .filter(detail => questionsTra.includes(detail.field3))
    // Filtrar preguntas duplicadas basadas en 'field3'
    .filter((detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
    );

  const uniqueMatchedDetailsTRA = matchedDetailsForQuestionsTRA.filter(
    (detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
  );

  const percentagesTRA = uniqueMatchedDetailsTRA.map(detail => parseFloat(detail.field4.replace('%', '')) || 0);
  
  const calculateGeneralAverageTra = () => {
    const total = percentagesTRA.reduce((acc, percentage) => acc + percentage, 0);
    return percentagesTRA.length > 0 ? (total / percentagesTRA.length).toFixed(2) : 'N/A';
  };

  // Calcula el promedio general una vez que `percentages` esté disponible
  const traAverage = calculateGeneralAverageTra();

  // Obtener porcentaje específico para LUM
  const getLUMPercentage = useCallback(() => {
    const lumDetail = tablaDetails.find((detail) => detail.field3 === questionLum[0]);
    return lumDetail ? parseFloat(lumDetail.field4.replace('%', '')) || 0 : 0;
  }, [tablaDetails]);

  // Agrupación de datos para la tabla y gráfico
  const groupedData = useMemo(() => {
    const unsortedData = Object.entries(moduleGroups).map(([groupName, modules]) => {
      let average = Number(calculateGroupAverage(modules as string[], groupName as ModuleGroupName));
  
      if (groupName === 'TRA') average = Number(traAverage);
      if (groupName === 'LUM') average = getLUMPercentage();
  
      return {
        groupName: groupName as ModuleGroupName,
        nombreCompleto: nombreCompletoPorGrupo[groupName as ModuleGroupName],
        average,
        percentage: ponderaciones[groupName as ModuleGroupName],
      };
    });
  
    const order: ModuleGroupName[] = ["BPM", "POES", "POE", "MA", "DOC", "TRA", "LUM"];
    return unsortedData.sort((a, b) => order.indexOf(a.groupName) - order.indexOf(b.groupName));
  }, [calculateGroupAverage, calculateGeneralAverageTra, getLUMPercentage]);
  

  const finalAverage = useMemo(() => {
    const averages = groupedData
      .filter((group) => group.groupName !== "TRA" && group.groupName !== "LUM")
      .map((group) => group.average);
    return (averages.reduce((acc, avg) => acc + avg, 0) / averages.length).toFixed(2);
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
