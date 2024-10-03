import './KPIGraph.css'
import Plot from 'react-plotly.js'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number | null }[];
}

const KPIGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  const Transporte = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
  ];
  const Servicios = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
  ];
  const Documentos = ['doc'];

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  }

  const filterByModules = (modules: string[]) =>
    moduleData.filter((module) => modules.includes(module.moduleName));

  const calculateAverage = (data: { moduleName: string, percentage: number | null }[]) => {
    const total = data.reduce((acc, module) => acc + (module.percentage ?? 100), 0);
    return data.length > 0 ? total / data.length : 100;
  }

  const transporteData = filterByModules(Transporte);
  const serviciosData = filterByModules(Servicios);
  const documentosData = filterByModules(Documentos);

  const transporteAvg = calculateAverage(transporteData);
  const serviciosAvg = calculateAverage(serviciosData);
  const documentosAvg = calculateAverage(documentosData);

  const promedioGeneral =
    (transporteAvg + serviciosAvg + documentosAvg) / 3;

  const moduleNames = ['Transporte', 'Servicios', 'Documentos', 'Promedio General'];
  const percentages = [transporteAvg, serviciosAvg, documentosAvg, promedioGeneral];

  const barColors = percentages.map((percentage) => getColorByPercentage(percentage));

  return (
    <div className="kpi-graph-container">
      <h4>Gráfico de Promedios en 3D KPI</h4>
      <Plot
        data={[
          {
            type: 'scatter3d',
            mode: 'markers',
            x: moduleNames,
            y: percentages,
            z: [1, 2, 3, 4], // This represents depth for the 3D chart
            marker: {
              size: 12,
              color: barColors,
            },
          },
        ]}
        layout={{
          title: 'Promedio de Respuestas por Módulo en 3D',
          scene: {
            xaxis: { title: 'Módulos' },
            yaxis: { title: 'Porcentaje (%)' },
            zaxis: { title: 'Profundidad' },
          },
          autosize: true,
          width: 800,
          height: 600,
        }}
      />
    </div>
  )
}

export default KPIGraph;
