import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IECriticalEvaluation.css';

const IECriticalEvaluation: React.FC = () => {

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 200,
      width: 200,
    },
    title: {
      text: '',
    },
    plotOptions: {
      pie: {
        innerSize: '0%',  // Esto lo mantiene como gráfico de torta (no tipo doughnut)
        dataLabels: {
          enabled: true, // Activa las etiquetas de cada categoría
          format: '{point.name}', // Muestra el nombre de cada categoría
        },
      },
    },
    series: [
      {
        name: 'Evaluación Crítica',
        colorByPoint: true,
        data: [
          { name: 'Infraestructura', y: 20, color: '#28a745' },
          { name: 'Equipamiento', y: 20, color: '#dc3545' },
          { name: 'Utensilios', y: 20, color: '#ffc107' },
          { name: 'Higiene Manipulador', y: 20, color: '#6c757d' },
          { name: 'Uniforme Completo', y: 20, color: '#343a40' },
        ],
      },
    ],
  };

  return (
    <div className="criticalEvaluation-container">
      <div className="card-evaluation-container">
        <div className="circular-graph-evaluation">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <div className="cards-evaluation">
          <div className="card-evaluation green">Infraestructura</div>
          <div className="card-evaluation red">Equipamiento</div>
          <div className="card-evaluation yellow">Utensilios</div>
          <div className="card-evaluation gray">Higiene Manipulador</div>
          <div className="card-evaluation black">Uniforme Completo</div>
        </div>
      </div>
    </div>
  );
}

export default IECriticalEvaluation;
