import './BPMGraph.css'
import Plot from 'react-plotly.js'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number | null }[];
}

const BPMGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  const bpmModules = ['infraestructura', 'legales']
  const poesModules = [
    'poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada',
    'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'
  ]
  const poeModules = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
  ]
  const maModules = ['MA'];
  const docModules = ['doc'];
  const lumModules = ['poes-superficies'];
  const traModules = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
  ]

  const calcularPromedioGrupo = (modulos: string[]) => {
    const modulosDelGrupo = moduleData.filter((mod) => modulos.includes(mod.moduleName));
    const total = modulosDelGrupo.reduce((acc, curr) => acc + (curr.percentage ?? 100), 0);
    return modulosDelGrupo.length > 0 ? total / modulosDelGrupo.length : 100;
  }

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  }

  const groupedData = [
    { groupName: 'BPM', average: calcularPromedioGrupo(bpmModules) },
    { groupName: 'POES', average: calcularPromedioGrupo(poesModules) },
    { groupName: 'POE', average: calcularPromedioGrupo(poeModules) },
    { groupName: 'MA', average: calcularPromedioGrupo(maModules) },
    { groupName: 'DOC', average: calcularPromedioGrupo(docModules) },
    { groupName: 'LUM', average: calcularPromedioGrupo(lumModules) },
    { groupName: 'TRA', average: calcularPromedioGrupo(traModules) },
  ]

  const groupNames = groupedData.map((group) => group.groupName)
  const groupAverages = groupedData.map((group) => group.average)
  const barColors = groupAverages.map((avg) => getColorByPercentage(avg))

  return (
    <div className="bpm-graph-container">
      <h3>Gráfico de Promedios por Grupo en 3D BPM</h3>
      <Plot
        data={[
          {
            type: 'bar',
            x: groupNames,
            y: groupAverages,
            marker: {
              color: barColors,
            },
          },
        ]}
        layout={{
          title: 'Promedio de Respuestas por Grupo',
          scene: {
            xaxis: { title: 'Grupos' },
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

export default BPMGraph;
