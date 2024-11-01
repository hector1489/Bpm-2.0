import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import './KPIGraph.css';
import { infraestructuraQuestions, legalesQuestions } from '../../utils/ConstModules'

interface BPMGraphProps {
  moduleData: { moduleName: string, question: string, answer: string, percentage: number | null }[];
}

// Inicializa Highcharts con la funcionalidad 3D
if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

const KPIGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  const extractPercentageFromAnswer = (answer: string): number | null => {
    if (answer === 'N/A') return null;
    const match = answer.match(/(\d+)%/);
    return match ? parseInt(match[1]) : null;
  };


  console.log(moduleData)
  // Function to calculate a specific submodule's average with error handling
  const calculateGeneralAverage = (percentages: number[]): string => {
    const validPercentages = percentages.filter(value => !isNaN(value));
    const total = validPercentages.reduce((acc, percentage) => acc + percentage, 0);
    return validPercentages.length > 0 ? (total / validPercentages.length).toFixed(2) : 'N/A';
  };

  // Filtra y convierte datos de un submódulo específico
  const calculateSubmoduleAverageBpm = (submoduleQuestions: string[]): string => {
    const submoduleData = moduleData
      .filter(data => submoduleQuestions.includes(data.question))
      .map(data => parseFloat(data.answer.replace('%', '')) || 0);
    return calculateGeneralAverage(submoduleData);
  };

  // Calcula el promedio de BPM, manejando posibles valores NaN
  const calculateBPM = (): string => {
    const infraAverage = parseFloat(calculateSubmoduleAverageBpm(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverageBpm(legalesQuestions));

    const validAverages = [infraAverage, legalesAverage].filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  };


  const bpmPercentage = calculateBPM();


  const doc97Detail = moduleData.find((module) =>
    module.question === 'DOC 97. Informes de muestreo microbiológico/luminometría. Planes de acción, charlas al personal si corresponde:'
  );
  const doc97Percentage = doc97Detail ? extractPercentageFromAnswer(doc97Detail.answer) : null;

  const csh31Detail = moduleData.find((module) =>
    module.question === 'TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):'
  );
  const csh31Percentage = csh31Detail ? extractPercentageFromAnswer(csh31Detail.answer) : null;

  const ser71Detail = moduleData.find((module) =>
    module.question === 'SER 71. Variedad de alternativas instaladas en línea autoservicio, según menú (fondos, ensaladas y postres, otros):'
  );
  const ser71Percentage = ser71Detail ? extractPercentageFromAnswer(ser71Detail.answer) : null;

  const cap101Detail = moduleData.find((module) =>
    module.question === 'CAP 101. Existe un programa escrito y con sus registros correspondientes de capacitación del personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69)'
  );
  const cap101Percentage = cap101Detail ? extractPercentageFromAnswer(cap101Detail.answer) : null;

  const getColorByPercentage = (percentage: number | null) => {
    if (percentage === null) return 'grey';
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  };

  const validAverages = [bpmPercentage, doc97Percentage, csh31Percentage, ser71Percentage, cap101Percentage]
    .filter((avg) => avg !== null)
    .map((avg) => typeof avg === 'string' ? parseFloat(avg) : avg);

  // Calcular el promedio general de los valores filtrados
  const promedioGeneral = validAverages.length > 0
    ? (validAverages.reduce((acc, avg) => acc + (avg ?? 0), 0) / validAverages.length)
    : null;


  const indicatorNames = ['BPM', 'DOC 97', 'TRA CSH 31', 'SER 71', 'CAP 101'];

  const itemWeights = ['25%', '25%', '25%', '25%', '25%']
  // Filter and map `percentages` to ensure only number | null values are passed
  const percentages = [bpmPercentage, doc97Percentage, csh31Percentage, ser71Percentage, cap101Percentage]
    .map((value) => (typeof value === 'string' ? parseFloat(value) : value)); // Convert string values to number

  const barColors = percentages.map((percentage) => getColorByPercentage(percentage));



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
      categories: indicatorNames,
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
            {indicatorNames.map((name, index) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{itemWeights[index]}</td>
                <td>{percentages[index] !== null ? percentages[index]?.toFixed(2) + '%' : 'N/A'}</td>
              </tr>
            ))}
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
