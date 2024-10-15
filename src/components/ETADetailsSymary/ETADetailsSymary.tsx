import './ETADetailsSymary.css';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getColorByPercentage } from '../../utils/utils'

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

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

const ETADetailsSymary: React.FC<ETADetailsSymaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

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
        console.log(data);
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

  const matchedDetails = tablaDetails.filter(detail =>
    questionsEta.includes(detail.field3)
  );


  const questionNames = matchedDetails.map(detail => detail.field3);
  const percentages = matchedDetails.map(detail => parseFloat(detail.field4.replace('%', '')) || 0);

  const barColors = percentages.map(getColorByPercentage);

  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70,
      },
    },
    title: {
      text: 'Porcentaje de Cumplimiento por Pregunta',
    },
    xAxis: {
      categories: questionNames,
      title: {
        text: 'Preguntas',
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
          },
        },
      },
    ],
    plotOptions: {
      column: {
        depth: 25,
      },
    },
  };

  return (
    <div className="ETADetailsSymary-container">
      <p>ETADetailsSymary - Número de Auditoría: {numeroAuditoria}</p>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default ETADetailsSymary;
