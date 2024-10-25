import './ETADetailsSymary.css';
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

interface ETADetailsSymaryProps {
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

const ETADetailsSymary: React.FC<ETADetailsSymaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

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

  // useEffect para filtrar los datos por numero de auditoría
  const bpmFilteredAuditSheet = () => {
    if (numeroAuditoria && auditSheetDetails) {
      const filteredData = auditSheetDetails.find(
        (sheet) => sheet.numero_auditoria === numeroAuditoria
      );
      setFilteredAuditSheet(filteredData || null);
    }
  };

  useEffect(() => {
    fetchAuditSheetDetails();
  }, [context?.state?.userName]);

  useEffect(() => {
    bpmFilteredAuditSheet();
  }, [auditSheetDetails, numeroAuditoria]);

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

  if (!filteredAuditSheet) {
    return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;
  }

  const matchedDetails = tablaDetails
    .filter(detail => questionsEta.includes(detail.field3))
    // Filtrar preguntas duplicadas basadas en 'field3'
    .filter((detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
    );

  const questionNames = matchedDetails.map(detail => detail.field3);
  const percentages = matchedDetails.map(detail => parseFloat(detail.field4.replace('%', '')) || 0);
  const barColors = percentages.map(getColorByPercentage);


  // Función para extraer el módulo
  const extractModulo = (pregunta: string) => {
    const match = pregunta.match(/^TRA \w+ \d+/);
    return match ? match[0] : 'N/A';
  };

  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70,
      },
      width: window.innerWidth < 768 ? 300 : null,
      height: 600,
    },
    title: {
      text: 'Porcentaje de Cumplimiento por Pregunta',
    },
    xAxis: {
      categories: questionNames,
      title: {
        text: '',
      },
      labels: {
        style: {
          fontSize: window.innerWidth < 768 ? '10px' : '12px',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Porcentaje (%)',
      },
    },
    series: [
      {
        name: 'Porcentaje',
        data: percentages,
        colorByPoint: true,
        colors: barColors,
        dataLabels: {
          enabled: true,
          format: '{y}%',
          style: {
            fontWeight: 'bold',
            color: 'black',
            fontSize: window.innerWidth < 768 ? '10px' : '12px',
          },
        },
      },
    ],
    plotOptions: {
      column: {
        depth: 25,
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
              height: 300,
            },
            xAxis: {
              labels: {
                style: {
                  fontSize: '8px',
                },
              },
            },
            yAxis: {
              labels: {
                style: {
                  fontSize: '8px',
                },
              },
            },
          },
        },
      ],
    },
  };

  // Función para calcular el promedio de los porcentajes
  const calculateGeneralAverage = () => {
    const total = percentages.reduce((acc, percentage) => acc + percentage, 0);
    return percentages.length > 0 ? (total / percentages.length).toFixed(2) : 'N/A';
  };

  // Calcula el promedio general una vez que `percentages` esté disponible
  const generalAverage = calculateGeneralAverage();

  const backgroundColor = getColorByPercentageFilas(parseInt(generalAverage));

  let textColor = 'black';
  if (backgroundColor === 'red') {
    textColor = 'white';
  } else if (backgroundColor === 'yellow') {
    textColor = 'black';
  }

  return (
    <div className="ETADetailsSymary-container">
      <h4>ETA</h4>
      <p>Número de Auditoría: {numeroAuditoria}</p>

      <div className="ETADetailsSummary-data">

        <div className="ETADetailsSummary-data-table">
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

        <div className='ETADetailsSummary-cumplimientos'>
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

          <p className="ETADetailsSummary-general-average" style={{ backgroundColor, color: textColor }}>
            Promedio General : <strong>{generalAverage} </strong>
          </p>

        </div>

      </div>

      <div className="ETADetailsSummary-graph">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      <table className="ETADetailsSummary-table">
        <thead>
          <tr style={{ backgroundColor: 'skyblue', color: 'black' }}>
            <th className='fw-bold text-uppercase'>Módulo</th>
            <th className='fw-bold text-uppercase'>Pregunta</th>
            <th className='fw-bold text-uppercase'>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {matchedDetails.map((detail, index) => (
            <tr key={index} style={{ backgroundColor: barColors[index], color: 'white' }}>
              <td>{extractModulo(detail.field3)}</td>
              <td>{detail.field3}</td>
              <td>{detail.field4}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ETADetailsSymary;
