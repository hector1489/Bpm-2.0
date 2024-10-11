import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IECriticalFindings.css';

const IECriticalFindings: React.FC = () => {

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 120,
      width: 120,
    },
    title: {
      text: '',
    },
    plotOptions: {
      pie: {
        innerSize: '70%',
        borderColor: null,
        dataLabels: {
          enabled: false,
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    series: [
      {
        data: [
          { y: 75, color: '#007bff' },
          { y: 25, color: '#e0e0e0' },
        ],
      },
    ],
  };
  

  return (
    <div className="IECriticalFinding-container">
      <div className="critical-card">

        <div className="circular-bar">
          <div className="doughnut-chart">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
          <div className="critical-text">
            <p>cuadro de img o text</p>
          </div>
        </div>

        <div className="percentage-bars">
          <div className="bar green" style={{ width: '75%' }}>Pregunta - 75%</div>
          <div className="bar red" style={{ width: '50%' }}>Desviación - 50%</div>
          <div className="bar yellow" style={{ width: '85%' }}>Criticidad - 85%</div>
          <div className="bar black" style={{ width: '30%' }}>Recomendaciones - 30%</div>
        </div>

      </div>

      <div className="critical-card">

        <div className="circular-bar">
          <div className="doughnut-chart">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
          <div className="critical-text">
            <p>cuadro de img o text</p>
          </div>
        </div>

        <div className="percentage-bars">
          <div className="bar green" style={{ width: '75%' }}>Pregunta - 75%</div>
          <div className="bar red" style={{ width: '50%' }}>Desviación - 50%</div>
          <div className="bar yellow" style={{ width: '85%' }}>Criticidad - 85%</div>
          <div className="bar black" style={{ width: '30%' }}>Recomendaciones - 30%</div>
        </div>

      </div>
    </div>
  );
}

export default IECriticalFindings;
