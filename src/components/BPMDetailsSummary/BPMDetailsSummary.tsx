import './BPMDetailsSummary.css';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getColorByPercentage, getColorByPercentageFilas } from '../../utils/utils';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

type ModuleGroupName = 'BPM' | 'POES' | 'POE' | 'MA' | 'DOC' | 'LUM' | 'TRA';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface TableDetailsSummaryProps {
  numeroAuditoria: string | null;
}

interface AuditSheet {
  username: string;
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
}

const BPMDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
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

  useEffect(() => {
    const fetchAuditSheetDetails = async () => {
      const username = context.state?.userName;
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        const auditSheetData = await getAuditSheetByUsername(username);
        setAuditSheetDetails(auditSheetData);
      } catch (err) {
        setError('Error al obtener los datos del audit sheet');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditSheetDetails();
  }, [context.state?.userName]);

  useEffect(() => {
    if (numeroAuditoria && auditSheetDetails) {
      const filteredData = auditSheetDetails.find(
        (sheet) => sheet.numero_auditoria === numeroAuditoria
      );
      setFilteredAuditSheet(filteredData || null);
    }
  }, [auditSheetDetails, numeroAuditoria]);

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

  const questionLum = ['LUM 21. Toma de muestra y uso de luminómetro:']



  const matchedDetailsForQuestionsTRA = tablaDetails
    .filter(detail => questionsEta.includes(detail.field3))
    // Filtrar preguntas duplicadas basadas en 'field3'
    .filter((detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
    );

    const uniqueMatchedDetailsTRA = matchedDetailsForQuestionsTRA.filter(
      (detail, index, self) =>
        index === self.findIndex((d) => d.field3 === detail.field3)
    );
  

  const traNA = uniqueMatchedDetailsTRA.map(detail => parseFloat(detail.field4.replace('%', '')) || 'N/A');
 
  const numericValuesTra = traNA.filter((value): value is number => typeof value === 'number');
const traAverage = numericValuesTra.length > 0
  ? numericValuesTra.reduce((acc, value) => acc + value, 0) / numericValuesTra.length
  : 0;
  

  const matchedDetailsForQuestionsLUM = tablaDetails
    .filter(detail => questionLum.includes(detail.field3))
    // Filtrar preguntas duplicadas basadas en 'field3'
    .filter((detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
    );

  const uniqueMatchedDetailsLUM = matchedDetailsForQuestionsLUM.filter(
    (detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
  );

  const lumNA = uniqueMatchedDetailsLUM.map(detail => parseFloat(detail.field4.replace('%', '')) || 'N/A');

   // Filtrar valores numéricos y calcular el promedio
const numericValues = lumNA.filter((value): value is number => typeof value === 'number');
const lumAverage = numericValues.length > 0
  ? numericValues.reduce((acc, value) => acc + value, 0) / numericValues.length
  : 0;

  console.log( traAverage);
  console.log(lumAverage);

// Calcular promedio específico para TRA
const calculateTRAAverage = useCallback(() => {
  const traModules = moduleGroups.TRA;
  const matchedDetailsTRA = tablaDetails
    .filter((detail) => traModules.includes(detail.field3))
    .map((detail) => parseFloat(detail.field4.replace('%', '')) || 0)
    .filter((percentage) => !isNaN(percentage));

  return matchedDetailsTRA.length > 0
    ? matchedDetailsTRA.reduce((acc, curr) => acc + curr, 0) / matchedDetailsTRA.length
    : 0;
}, [tablaDetails]);

// Obtener porcentaje específico para LUM
const getLUMPercentage = useCallback(() => {
  const lumDetail = tablaDetails.find((detail) => detail.field3 === questionLum[0]);
  return lumDetail ? parseFloat(lumDetail.field4.replace('%', '')) || 0 : 0;
}, [tablaDetails]);

// Agrupación de datos para la tabla y gráfico
const groupedData = useMemo(() => {
  const unsortedData = Object.entries(moduleGroups).map(([groupName, modules]) => {
    let average = calculateGroupAverage(modules as string[], groupName as ModuleGroupName);
    
    // Asignar los valores específicos de TRA y LUM
    if (groupName === 'TRA') average = calculateTRAAverage();
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
}, [calculateGroupAverage, calculateTRAAverage, getLUMPercentage]);

  const finalAverage = useMemo(() => {
    const averages = groupedData
      .filter((group) => group.groupName !== "TRA" && group.groupName !== "LUM")
      .map((group) => group.average);
    return (averages.reduce((acc, avg) => acc + avg, 0) / averages.length).toFixed(2);
  }, [groupedData]);



  const nonApplicableModules = Object.keys(moduleGroups).filter(
    (group) => !groupedData.some((data) => data.groupName === group)
  );

  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
      reflow: true,
    },
    title: { text: 'Promedios por Módulo' },
    xAxis: {
      categories: [...groupedData.map(g => g.groupName), 'PROM']
    },
    yAxis: { title: { text: 'Porcentaje (%)' } },
    series: [
      {
        name: 'Promedio',
        data: [...groupedData.map(g => g.average), parseFloat(finalAverage)],
        colorByPoint: true,
        colors: groupedData.map(g => getColorByPercentage(g.average)),
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
          inside: false,
          style: { fontWeight: 'bold', color: 'black' },
        },
      },
    ],
  };

  const backgroundColor = getColorByPercentageFilas(parseFloat(finalAverage));
  const textColor = backgroundColor === 'red' ? 'white' : 'black';

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;
  if (!filteredAuditSheet) return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;

  return (
    <div className="BPMDetailsSummary-container">
      <h3>Gráfico BPM Auditoría: {numeroAuditoria}</h3>

      <div className="BPMDetailsSummary-data">
        <div className="BPMDetailsSummary-data-table">
          <table>
            <thead>
              <tr><th>Nombre del Establecimiento:</th><td>{filteredAuditSheet?.field1 || 'N/A'}</td></tr>
              <tr><th>Número de Auditoría:</th><td>{filteredAuditSheet?.numero_auditoria || 'N/A'}</td></tr>
              <tr><th>Gerente del Establecimiento:</th><td>{filteredAuditSheet?.field2 || 'N/A'}</td></tr>
              <tr><th>Administrador del Establecimiento:</th><td>{filteredAuditSheet?.field3 || 'N/A'}</td></tr>
              <tr><th>Supervisor del Establecimiento:</th><td>{filteredAuditSheet?.field4 || 'N/A'}</td></tr>
              <tr><th>Auditor Email:</th><td>{filteredAuditSheet?.field5 || 'N/A'}</td></tr>
              <tr><th>Fecha de Auditoría:</th><td>{filteredAuditSheet?.field6 || 'N/A'}</td></tr>
            </thead>
          </table>
        </div>

        <div className="BPMDetailsSummary-cumplimientos" >
          <div style={{ fontSize: 'smaller', marginTop: '10px' }}>
            <div
              style={{
                backgroundColor: 'green',
                padding: '5px',
                border: '1px solid black',
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              CUMPLE 90% - 100%
            </div>
            <div
              style={{
                backgroundColor: 'yellow',
                padding: '5px',
                border: '1px solid black',
                marginTop: '5px',
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              EN ALERTA 75% - 89%
            </div>
            <div
              style={{
                backgroundColor: 'red',
                padding: '5px',
                border: '1px solid black',
                marginTop: '5px',
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              CRITICO 0% - 74%
            </div>
          </div>

          <p className="TableDetailsDD-general-average" style={{ backgroundColor, color: textColor }} >Promedio General : <strong>{finalAverage}%</strong></p>
        </div>
      </div>

      <div className="BPMDetailsSummary-graph">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { width: '100%', height: '100%' } }}
        />
      </div>

      <table className="BPMDetailsSummary-table">
        <thead>
          <tr>
            <th>Modulo</th>
            <th>Nombre</th>
            <th>Ponderacion</th>
            <th>Promedio</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((group) => (
            <tr key={group.groupName}>
              <td>{group.groupName}</td>
              <td>{group.nombreCompleto}</td>
              <td>{group.percentage}%</td>
              <td>{group.average.toFixed(2)}%</td>
              <td>{((group.average * group.percentage) / 100).toFixed(1)}%</td>
            </tr>
          ))}
          <tr className="bg-warning">
            <td colSpan={4}><strong>PROMEDIO FINAL PONDERADO</strong></td>
            <td>{finalAverage}%</td>
          </tr>
        </tbody>
      </table>

      {nonApplicableModules.length > 0 && (
        <div className="BPMDetailsSummary-non-applicable-modules">
          <p>Módulos no aplicables o sin datos:</p>
          <ul>
            {nonApplicableModules.map((module, index) => (
              <li key={index}>{module}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BPMDetailsSummary;
