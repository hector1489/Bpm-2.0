import './BPMDetailsSummary.css';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getColorByPercentage, getColorByPercentageFilas } from '../../utils/utils';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';

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

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

const BPMDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nonApplicableModules, setNonApplicableModules] = useState<string[]>([]);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

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

  const fetchAuditSheetDetails = async () => {
    const username = state?.userName;
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

  useEffect(() => {
    fetchAuditSheetDetails();
  }, [state?.userName]);

  useEffect(() => {
    if (numeroAuditoria && auditSheetDetails) {
      const filteredData = auditSheetDetails.find(
        (sheet) => sheet.numero_auditoria === numeroAuditoria
      );
      setFilteredAuditSheet(filteredData || null);
    }
  }, [auditSheetDetails, numeroAuditoria]);

  // Cálculo del promedio y módulos no aplicables en un efecto separado
  useEffect(() => {
    if (tablaDetails.length > 0) {
      const nonApplicable = tablaDetails
        .filter((mod) => mod.field4 === null || mod.field4 === 'N/A')
        .map((mod) => mod.field2);
      setNonApplicableModules(nonApplicable);
    }
  }, [tablaDetails]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!filteredAuditSheet) {
    return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;
  }

  // Definición de los módulos
  const bpmModules = ['infraestructura', 'legales'];
  const poesModules = [
    'poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada',
    'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones',
  ];
  const poeModules = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt',
  ];
  const maModules = ['MA'];
  const docModules = ['doc'];

  const traModules = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc',
  ];
  const ponderaciones = {
    bpm: 4,
    poes: 25,
    poe: 25,
    ma: 4,
    doc: 10,
    lum: 10,
    tra: 21,
  };


  const calcularPromedioGrupo = (modulos: string[]) => {
    const modulosDelGrupo = tablaDetails.filter((mod) => modulos.includes(mod.field2));

    const validItems = modulosDelGrupo.filter((mod) => mod.field4 !== null && mod.field4 !== 'N/A');

    const total = validItems.reduce((acc, curr) => acc + parseFloat(curr.field4), 0);

    return validItems.length > 0 ? total / validItems.length : 100;
  };

  const lumQuestion = 'LUM 21. Toma de muestra y uso de luminómetro';

  const matchedDetails = tablaDetails.filter(detail =>
    detail.field3 && detail.field3.toLowerCase().includes(lumQuestion.toLowerCase().trim())
  );



  const uniqueMatchedDetails = matchedDetails.filter(
    (detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
  );

  const lumNA = uniqueMatchedDetails.map(detail => parseFloat(detail.field4.replace('%', '')) || 'N/A');


  const numericValues = lumNA.filter((value): value is number => typeof value === 'number');
  const lumAverage = numericValues.length > 0
    ? numericValues.reduce((acc, value) => acc + value, 0) / numericValues.length
    : 0;

  const groupedData = [
    { groupName: 'BPM', nombreCompleto: 'INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES', percentage: ponderaciones.bpm, average: calcularPromedioGrupo(bpmModules) },
    { groupName: 'POES', nombreCompleto: 'PROCEDIMIENTOS OP. DE SANITIZACION', percentage: ponderaciones.poes, average: calcularPromedioGrupo(poesModules) },
    { groupName: 'POE', nombreCompleto: 'PROCEDIMIENTOS OP. DEL PROCESO', percentage: ponderaciones.poe, average: calcularPromedioGrupo(poeModules) },
    { groupName: 'MA', nombreCompleto: 'MANEJO AMBIENTAL', percentage: ponderaciones.ma, average: calcularPromedioGrupo(maModules) },
    { groupName: 'DOC', nombreCompleto: 'DOCUMENTACION', percentage: ponderaciones.doc, average: calcularPromedioGrupo(docModules) },
    { groupName: 'LUM', nombreCompleto: 'LUMINOMETRIA', percentage: ponderaciones.lum, average: lumAverage },
    { groupName: 'TRAZ', nombreCompleto: 'TRAZADORES DE POSIBLE BROTE ETA', percentage: ponderaciones.tra, average: calcularPromedioGrupo(traModules) },
  ];

  const validGroupAverages = groupedData.filter(group => group.average !== null);
  const overallAverage = validGroupAverages.length > 0
    ? validGroupAverages.reduce((acc, curr) => acc + curr.average, 0) / validGroupAverages.length
    : 0;

  // Obtener los nombres de los grupos
  const groupNames = groupedData.map((group) => group.groupName).concat('PROM');

  // Filtrar promedios y evitar incluir `null` en los promedios del gráfico
  const groupAverages = groupedData.map((group) => {
    return group.average !== null ? group.average : null;
  }).concat(overallAverage);



  const barColors = groupAverages.map((avg) => avg !== null ? getColorByPercentage(avg) : 'transparent');


  // Opciones del gráfico
  const chartOptions = {
    chart: {
      type: 'column',
      renderTo: 'container',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
      reflow: true,
    },
    title: {
      text: 'Promedios por Módulo',
    },
    xAxis: {
      categories: groupNames,
      title: {
        text: '',
      },
    },
    yAxis: {
      title: {
        text: 'Porcentaje (%)',
      },
    },
    series: [
      {
        name: 'Promedio',
        // Filtrar los valores `null`
        data: groupAverages.filter(avg => avg !== null),
        colorByPoint: true,
        colors: barColors,
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
          inside: false,
          style: {
            fontWeight: 'bold',
            color: 'black',
          },
        },
      },
    ],
    plotOptions: {
      column: {
        depth: 25,
      },
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              options3d: {
                depth: 30,
              },
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
  };

  const backgroundColor = getColorByPercentageFilas(parseFloat(overallAverage.toFixed(2)));

  let textColor = 'black';
  if (backgroundColor === 'red') {
    textColor = 'white';
  } else if (backgroundColor === 'yellow') {
    textColor = 'black';
  }

  return (
    <div className="BPMDetailsSummary-container">
      <h3>Gráfico BPM Auditoría: {numeroAuditoria}</h3>

      <div className="BPMDetailsSummary-data">

        <div className="BPMDetailsSummary-data-table">
          <table>
            <thead>
              <tr>
                <th>Nombre del Establecimiento:</th>
                <td>{filteredAuditSheet?.field1 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Número de Auditoría:</th>
                <td>{filteredAuditSheet?.numero_auditoria || 'N/A'}</td>
              </tr>
              <tr>
                <th>Gerente del Establecimiento:</th>
                <td>{filteredAuditSheet?.field2 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Administrador del Establecimiento:</th>
                <td>{filteredAuditSheet?.field3 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Supervisor del Establecimiento:</th>
                <td>{filteredAuditSheet?.field4 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Auditor Email:</th>
                <td>{filteredAuditSheet?.field5 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Fecha de Auditoría:</th>
                <td>{filteredAuditSheet?.field6 || 'N/A'}</td>
              </tr>
            </thead>
          </table>

        </div>

        <div className='BPMDetailsSummary-cumplimientos'>
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
            }}>
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
            }}>
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
            }}>
            CRITICO 0% - 74%
          </div>

          <p className="BPMDetailsSummary-general-average" style={{ backgroundColor, color: textColor }}>
            Promedio General : <strong>{overallAverage.toFixed(2)}</strong>
          </p>

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
        </thead>
        <tbody>
          {groupedData.map((group) => (
            <tr key={group.groupName}>
              <td>{group.groupName}</td>
              <td>{group.nombreCompleto}</td>
              <td>{group.percentage}%</td>
              <td>{group.average !== null ? group.average.toFixed(2) : 'N/A'}%</td>
              <td>{group.average !== null ? ((group.average * group.percentage) / 100).toFixed(1) : 'N/A'}%</td>
            </tr>
          ))}
          <tr className="bg-warning">
            <td colSpan={4}><strong>PROMEDIO FINAL PONDERADO</strong></td>
            <td>{overallAverage.toFixed(2)}%</td>
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
