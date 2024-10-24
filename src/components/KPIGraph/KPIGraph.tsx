import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import './KPIGraph.css';

interface BPMGraphProps {
  moduleData: { moduleName: string, question: string, answer: string, percentage: number | null }[];
}

// Inicializa Highcharts con la funcionalidad 3D
if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

const KPIGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  // Define los módulos por categoría
  const Transporte = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
  ];
  const Servicios = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
  ];
  const Documentos = ['doc'];

  // Función para extraer el porcentaje de la respuesta, si la respuesta es "N/A" devuelve null
  const extractPercentageFromAnswer = (answer: string): number | null => {
    if (answer === 'N/A') return null;
    const match = answer.match(/(\d+)%/);
    return match ? parseInt(match[1]) : null;
  };

  // Buscar CAP 101
  const cap101Detail = moduleData.find((module) =>
    module.question === 'CAP 101. Existe un programa escrito y con sus registros correspondientes de capacitación del personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69)'
  );
  const cap101Percentage = cap101Detail ? extractPercentageFromAnswer(cap101Detail.answer) : null;

  // Función para determinar el color basado en el porcentaje
  const getColorByPercentage = (percentage: number | null) => {
    if (percentage === null) return 'grey';
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  };

  // Filtrar los datos por módulo
  const filterByModules = (modules: string[]) =>
    moduleData.filter((module) => modules.includes(module.moduleName));

  // Calcula el promedio de los porcentajes, excluyendo los `null`
  const calculateAverage = (data: { moduleName: string, percentage: number | null }[]) => {
    const validData = data.filter((module) => module.percentage !== null);
    const total = validData.reduce((acc, module) => acc + (module.percentage ?? 0), 0);
    return validData.length > 0 ? total / validData.length : null;
  };

  // Filtrar y calcular promedios para cada categoría
  const transporteData = filterByModules(Transporte);
  const serviciosData = filterByModules(Servicios);
  const documentosData = filterByModules(Documentos);

  const transporteAvg = calculateAverage(transporteData);
  const serviciosAvg = calculateAverage(serviciosData);
  const documentosAvg = calculateAverage(documentosData);

  // Calcular el promedio general incluyendo CAP 101 si está presente, excluyendo `null`
  const validAverages = [transporteAvg, serviciosAvg, documentosAvg, cap101Percentage].filter(avg => avg !== null);
  const promedioGeneral = validAverages.length > 0 ? validAverages.reduce((acc, avg) => acc + (avg ?? 0), 0) / validAverages.length : null;

  // Configurar nombres de los módulos, porcentajes y pesos
  const moduleNames = ['Transporte', 'Servicios', 'Documentos'];
  const percentages = [transporteAvg, serviciosAvg, documentosAvg];
  const itemWeights = ['25%', '25%', '25%'];

  // Asignar colores a las barras según el porcentaje
  const barColors = [...percentages.map(getColorByPercentage), getColorByPercentage(cap101Percentage)];

  // Opciones del gráfico de Highcharts
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
      categories: [...moduleNames, 'CAP 101'],
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
        data: [...percentages, cap101Percentage],
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
            <tr style={{ backgroundColor: 'skyblue', color: 'black' }}>
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
                <td>{percentages[index] !== null ? percentages[index]?.toFixed(2) + '%' : 'N/A'}</td>
              </tr>
            ))}
            {cap101Percentage !== null ? (
              <tr>
                <td>CAP 101</td>
                <td>25%</td>
                <td>{cap101Percentage?.toFixed(2)}%</td>
              </tr>
            ) : (
              <tr>
                <td>CAP 101</td>
                <td>25%</td>
                <td>N/A</td>
              </tr>
            )}
            <tr className="bg-warning">
              <td><strong>TOTAL ALIMENTACIÓN</strong></td>
              <td><strong>100%</strong></td>
              <td><strong>{promedioGeneral !== null ? promedioGeneral.toFixed(2) + '%' : 'N/A'}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIGraph;
