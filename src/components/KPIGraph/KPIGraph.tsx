import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import './KPIGraph.css';

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number | null }[];
}

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
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
  };

  const filterByModules = (modules: string[]) =>
    moduleData.filter((module) => modules.includes(module.moduleName));

  const calculateAverage = (data: { moduleName: string, percentage: number | null }[]) => {
    const total = data.reduce((acc, module) => acc + (module.percentage ?? 100), 0);
    return data.length > 0 ? total / data.length : 100;
  };

  const transporteData = filterByModules(Transporte);
  const serviciosData = filterByModules(Servicios);
  const documentosData = filterByModules(Documentos);

  const transporteAvg = calculateAverage(transporteData);
  const serviciosAvg = calculateAverage(serviciosData);
  const documentosAvg = calculateAverage(documentosData);

  const promedioGeneral = (transporteAvg + serviciosAvg + documentosAvg) / 3;

  const moduleNames = ['Alimentación Insp. BPM', 'Alimentación Cum. Inutas', 'Alimentación Exam. Manip.', 'Alimentación Inap. Microb.'];
  const percentages = [transporteAvg, serviciosAvg, documentosAvg, promedioGeneral];
  const itemWeights = ['25%', '25%', '25%', '25%'];

  const barColors = percentages.map((percentage) => getColorByPercentage(percentage));

  const chartOptions = {
    chart: {
      type: 'bar',
      backgroundColor: '#ffffff',
      renderTo: 'container',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      text: 'Indicadores de Alimentación',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333333',
      },
    },
    xAxis: {
      categories: moduleNames,
      title: {
        text: '',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      lineColor: '#cccccc',
      tickColor: '#cccccc',
    },
    yAxis: {
      title: {
        text: 'Porcentaje (%)',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      gridLineColor: '#e6e6e6',
      labels: {
        style: {
          color: '#666666',
        },
      },
    },
    series: [
      {
        name: 'Promedio',
        data: percentages,
        colorByPoint: true,
        colors: barColors,
      },
    ],
    plotOptions: {
      bar: {
        depth: 25,
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };
  

  return (
    <div className="kpi-graph-container">
      <h3>KPI</h3>
      <div className="kpi-graph-graph">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
     
      <div className="kpi-graph-table">
      <table id="kpi-percentage-table">
        <thead>
          <tr style={{ backgroundColor: 'skyblue', color:'black' }}>
            <th>INDICADOR</th>
            <th>PONDERACIÓN ITEM CODELCO (25%)</th>
            <th>PROMEDIO</th>
          </tr>
        </thead>
        <tbody>
          {moduleNames.map((name, index) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{itemWeights[index]}</td>
              <td>{percentages[index].toFixed(2)}%</td>
            </tr>
          ))}
          <tr className='bg-warning'>
            <td><strong>TOTAL ALIMENTACIÓN</strong></td>
            <td><strong>100%</strong></td>
            <td><strong>{promedioGeneral.toFixed(2)}%</strong></td>
          </tr>
        </tbody>
      </table>
      </div>
      
    </div>
  );
};

export default KPIGraph;
