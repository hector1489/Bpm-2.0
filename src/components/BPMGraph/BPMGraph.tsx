import './BPMGraph.css'
import Plot from 'react-plotly.js'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number }[];
}

const BPMGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  const moduleNames = moduleData.map((module) => module.moduleName);
  const percentages = moduleData.map((module) => module.percentage);

  return (
    <div className="bpm-graph-container">
      <h3>Gráfico de Promedios en 3D BPM</h3>
      <Plot
        data={[
          {
            type: 'bar',
            x: moduleNames,
            y: percentages,
            marker: {
              color: 'rgba(75, 192, 192, 0.6)',
            },
          },
        ]}
        layout={{
          title: 'Promedio de Respuestas por Módulo',
          scene: {
            xaxis: { title: 'Módulos' },
            yaxis: { title: 'Porcentaje (%)' },
          },
          autosize: true,
          width: 800,
          height: 600,
        }}
      />
    </div>
  )
}

export default BPMGraph
