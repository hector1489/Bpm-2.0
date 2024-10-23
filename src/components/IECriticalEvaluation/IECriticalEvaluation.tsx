import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IECriticalEvaluation.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IECriticalEvaluationProps {
  tablaDetails: TablaDetail[];
}

const IECriticalEvaluation: React.FC<IECriticalEvaluationProps> = ({ tablaDetails }) => {

  if (!tablaDetails || tablaDetails.length === 0) {
    return <div>No hay datos disponibles para mostrar.</div>;
  }

  const IECriticalEvaluationData = [
    {
      name: 'Infraestructura',
      category: 'ELB 62. Sistema de extracción e inyección de aire, en correcto funcionamiento, limpio y con registro de limpieza de ducto:',
      color: '#28a745'
    },
    {
      name: 'Equipamiento',
      category: 'INF 2. Equipos mínimos de cocción y frío (quemadores, refrigeradores, mantenedores, otros):',
      color: '#dc3545'
    },
    {
      name: 'Utensilios',
      category: 'PRE 54. Materias primas ya procesadas en recipientes o envases lavables y tapadas:',
      color: '#ffc107'
    },
    {
      name: 'Higiene Manipulador',
      category: 'CSH 28. Cubre-pelo (gorro o cofia), mascarilla y guantes usados correctamente (Art.56):',
      color: '#6c757d'
    },
    {
      name: 'Uniforme Completo',
      category: 'CSH 27. Uniforme completo de todos, limpio y en buen estado - Sin accesorios adicionales (reloj, joyas, celular, otros) (Art.56):',
      color: '#343a40'
    }
  ];

  // Mapeo de datos de evaluación
  const evaluationData = IECriticalEvaluationData.map((item) => {
    const matchingDetails = tablaDetails.filter((detalle) =>
      detalle.field3.toLowerCase().includes(item.category.split('.')[0].toLowerCase())
    );

    const totalPercentage = matchingDetails.reduce((acc, detalle) => acc + parseInt(detalle.field4), 0);
    const averagePercentage = matchingDetails.length > 0 ? totalPercentage / matchingDetails.length : 0;

    return {
      name: item.name,
      y: averagePercentage,
      color: item.color
    };
  });

  const totalAverage = evaluationData.reduce((acc, data) => acc + data.y, 0) / evaluationData.length;

  // Opciones del gráfico
  const renderChartOptions = () => {
    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 400,
        maxWidth: 400,
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        text: 'Evaluación Crítica',
      },
      plotOptions: {
        pie: {
          innerSize: '40%',
          depth: 30,
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.1f}%',
          },
        },
      },
      series: [
        {
          name: 'Evaluación Crítica',
          colorByPoint: true,
          data: evaluationData.filter((d) => d.y > 0),
        },
      ],
    };
  };

  return (
    <div className="criticalEvaluation">

    <div className="criticalEvaluation-container">
      <div className="circular-graph-evaluation">
        <HighchartsReact highcharts={Highcharts} options={renderChartOptions()} />
      </div>

      <div className="cards-evaluation">
        {IECriticalEvaluationData.map((item, index) => (
          <div key={index} className={`card-evaluation`} style={{ backgroundColor: item.color }}>
            {item.name}
          </div>
        ))}
      </div>

      
    </div>

    <div className="average-total">
        <p>Promedio Total : {totalAverage.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default IECriticalEvaluation;
