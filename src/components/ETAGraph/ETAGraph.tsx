import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './ETAGraph.css';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

Highcharts3D(Highcharts);

interface ETAGraphProps {
  moduleData: { moduleName: string; percentage: number }[];
}

const ETAGraph: React.FC<ETAGraphProps> = ({ moduleData }) => {
  const context = useContext(AppContext);
  console.log(moduleData);
  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

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

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  };


  const etaData = state.IsHero
    .filter((question) => questionsEta.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      const percentageMatch = answer.match(/^\d+/);
      const percentage = percentageMatch ? parseInt(percentageMatch[0], 10) : 0;

      const shortQuestionName = question.question.split('.')[0] + '.';

      return {
        question: question.question,
        shortQuestion: shortQuestionName,
        percentage,
      };
    });

  const questionNames = etaData.map((data) => data.shortQuestion);
  const percentages = etaData.map((data) => data.percentage);
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
      text: 'Promedio de Respuestas por Pregunta ETA (3D)',
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
      },
    ],
    plotOptions: {
      column: {
        depth: 25,
      },
    },
  };

  return (
    <div className="eta-graph-container">
      <h4>Gráfico de Promedios en ETA 3D</h4>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default ETAGraph;
