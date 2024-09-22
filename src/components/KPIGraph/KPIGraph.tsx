import './KPIGraph.css'
import Plot from 'react-plotly.js'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number }[];
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

  const filterByModules = (modules: string[]) =>
    moduleData.filter((module) => modules.includes(module.moduleName));

  const calculateAverage = (data: { moduleName: string, percentage: number }[]) =>
    data.reduce((acc, module) => acc + module.percentage, 0) / data.length || 0;

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

  return (
    <div className="kpi-graph-container">
      <h4>Gráfico de Promedios en 3D KPI</h4>
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

export default KPIGraph
