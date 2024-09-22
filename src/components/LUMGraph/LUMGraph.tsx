import './LUMGraph.css'
import Plot from 'react-plotly.js'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number }[];
}

const LUMGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  const lumModules = ['poes-superficies'];


  const lumData = moduleData.filter((module) => lumModules.includes(module.moduleName));

  const moduleNames = lumData.map((module) => module.moduleName);
  const percentages = lumData.map((module) => module.percentage);

  return (
    <div className="lum-graph-container">
      <h4>Gráfico de Promedios en 3D LUM</h4>
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
          title: 'Promedio de Respuestas para LUM',
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
  );
}

export default LUMGraph;
