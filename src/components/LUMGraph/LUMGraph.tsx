import './LUMGraph.css'
import Plot from 'react-plotly.js'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number }[];
}

const LUMGraph: React.FC<BPMGraphProps> = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;
  const lumQuestion= ['LUM 21. Toma de muestra y uso de luminómetro:'];

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  }

  const etaData = state.IsHero
    .filter((question) => lumQuestion.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      const percentageMatch = answer.match(/^\d+/);
      const percentage = percentageMatch ? parseInt(percentageMatch[0]) : 0;

      return {
        question: question.question,
        shortQuestion: 'LUM 21',
        percentage: percentage,
      };
    });

  const questionNames = etaData.map((data) => data.shortQuestion);
  const percentages = etaData.map((data) => data.percentage);

  const barColors = percentages.map((percentage) => getColorByPercentage(percentage));

  return (
    <div className="lum-graph-container">
      <h4>Gráfico de Promedios en 3D LUM</h4>
      <Plot
        data={[
          {
            type: 'bar',
            x: questionNames,
            y: percentages,
            marker: {
              color: barColors,
            },
          },
        ]}
        layout={{
          title: 'Promedio de Respuestas para LUM 21',
          xaxis: { title: 'Pregunta' },
          yaxis: { title: 'Porcentaje (%)', range: [0, 100] },
          autosize: true,
          width: 800,
          height: 600,
        }}
      />
    </div>
  )
}

export default LUMGraph
