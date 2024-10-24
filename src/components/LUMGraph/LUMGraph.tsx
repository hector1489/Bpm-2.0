import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './LUMGraph.css';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';

Highcharts3D(Highcharts);

const LUMGraph: React.FC = () => {
  const context = useContext(AppContext);
  const [nonApplicable, setNonApplicable] = useState(false);

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

  const lumData = state.IsHero
    .filter((question) => lumQuestion.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      let percentage = 0;

      if (answer !== 'N/A' && answer !== null) {
        const percentageMatch = answer.match(/^\d+/);
        percentage = percentageMatch ? parseInt(percentageMatch[0], 10) : 0;
      }

      return {
        question: question.question,
        shortQuestion: 'LUM 21',
        percentage,
        isNotApplicable: answer === 'N/A' || answer === null,
      };
    });

  useEffect(() => {
    const hasNonApplicable = lumData.some((data) => data.isNotApplicable);
    setNonApplicable(hasNonApplicable);
  }, [lumData]);

  const questionNames = lumData.map((data) => data.shortQuestion);
  const percentages = lumData.map((data) => data.percentage);
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
      text: '',
    },
    xAxis: {
      categories: questionNames,
      title: {
        text: '',
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
        dataLabels: {
          enabled: true,
        },
      },
    },
  };

  return (
    <div className="lum-graph-container">
      <h4>LUM.</h4>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      {nonApplicable && (
        <p className="na-message">Esta pregunta no aplica ('N/A')</p>
      )}
    </div>
  );
};

export default LUMGraph;
