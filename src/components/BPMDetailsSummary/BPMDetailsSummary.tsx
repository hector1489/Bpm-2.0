import './BPMDetailsSummary.css';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getColorByPercentage } from '../../utils/utils';

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

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

const BPMDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

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

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  console.log(tablaDetails);

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
  const lumModules = ['poes-superficies'];
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

  // Función para calcular el promedio de un grupo o asignar 100% si no hay datos
  const calcularPromedioGrupo = (modulos: string[]) => {
    const modulosDelGrupo = tablaDetails.filter((mod) => modulos.includes(mod.field2));
    const total = modulosDelGrupo.reduce((acc, curr) => acc + parseFloat(curr.field4 ?? '100'), 0);
    return modulosDelGrupo.length > 0 ? total / modulosDelGrupo.length : 100;
  };

  // Agrupación de datos por módulos
  const groupedData = [
    { groupName: 'BPM', nombreCompleto: 'INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES', percentage: ponderaciones.bpm, average: calcularPromedioGrupo(bpmModules) },
    { groupName: 'POES', nombreCompleto: 'PROCEDIMIENTOS OP. DE SANITIZACION', percentage: ponderaciones.poes, average: calcularPromedioGrupo(poesModules) },
    { groupName: 'POE', nombreCompleto: 'PROCEDIMIENTOS OP. DEL PROCESO', percentage: ponderaciones.poe, average: calcularPromedioGrupo(poeModules) },
    { groupName: 'MA', nombreCompleto: 'MANEJO AMBIENTAL', percentage: ponderaciones.ma, average: calcularPromedioGrupo(maModules) },
    { groupName: 'DOC', nombreCompleto: 'DOCUMENTACION', percentage: ponderaciones.doc, average: calcularPromedioGrupo(docModules) },
    { groupName: 'LUM', nombreCompleto: 'LUMINOMETRIA', percentage: ponderaciones.lum, average: calcularPromedioGrupo(lumModules) },
    { groupName: 'TRAZ', nombreCompleto: 'TRAZADORES DE POSIBLE BROTE ETA', percentage: ponderaciones.tra, average: calcularPromedioGrupo(traModules) },
  ];

  // Calcular el promedio general
  const overallAverage = groupedData.reduce((acc, curr) => acc + curr.average, 0) / groupedData.length;

  const groupNames = groupedData.map((group) => group.groupName).concat('PROM');
  const groupAverages = groupedData.map((group) => group.average).concat(overallAverage);
  const barColors = groupAverages.map((avg) => getColorByPercentage(avg));

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
        data: groupAverages,
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

  return (
    <div className="BPMDetailsSummary-container">
      <h3>Grafico BPM Auditoría: {numeroAuditoria}</h3>

      <div className="BPMDetailsSummary-data">

        <div className="BPMDetailsSummary-data-table">

          <table>
            <thead>
              <tr>
                <th>Nombre del Establecimiento:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
              <tr>
                <th>Número de Auditoría:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
              <tr>
                <th>Gerente del Establecimiento:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
              <tr>
                <th>Administrador del Establecimiento:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
              <tr>
                <th>Supervisor del Establecimiento:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
              <tr>
                <th>Auditor Email:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
              <tr>
                <th>Fecha:</th>
                <td>
                  <span id="resumen-nombre-establecimiento" className="resumen-span">
                    { }
                  </span>
                </td>
              </tr>
            </thead>
          </table>

        </div>

        <div className="BPMDetailsSummary-data-promedio">

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
            <th>Módulo</th>
            <th>Descripción</th>
            <th>% Ponderado</th>
            <th>Promedio (%)</th>
            <th>Promedio Ponderado (%)</th>
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
          <tr className='bg-warning'>
            <td colSpan={4}><strong>PROMEDIO FINAL PONDERADO</strong></td>
            <td>{overallAverage.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BPMDetailsSummary;
