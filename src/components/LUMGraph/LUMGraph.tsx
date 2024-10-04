import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './LUMGraph.css';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

Highcharts3D(Highcharts);

const LUMGraph: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;
  const lumQuestion = ['LUM 21. Toma de muestra y uso de luminómetro:'];

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  };

  const etaData = state.IsHero
    .filter((question) => lumQuestion.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      const percentageMatch = answer.match(/^\d+/);
      const percentage = percentageMatch ? parseInt(percentageMatch[0], 10) : 0;

      return {
        question: question.question,
        shortQuestion: 'LUM 21',
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
      text: 'Promedio de Respuestas para LUM 21 (3D)',
    },
    xAxis: {
      categories: questionNames,
      title: {
        text: 'Pregunta',
      },
    },
    yAxis: {
      title: {
        text: 'Porcentaje (%)',
      },
      max: 100,
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
    <div className="lum-graph-container">
      <h4>Gráfico de Promedios en 3D LUM</h4>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LUMGraph;
