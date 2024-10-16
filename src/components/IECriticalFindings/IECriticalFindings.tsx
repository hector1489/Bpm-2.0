import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IECriticalFindings.css';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IECriticalFindingsProps {
  detallesFiltrados: TablaDetail[];
}

const IECriticalFindings: React.FC<IECriticalFindingsProps> = ({ detallesFiltrados }) => {
  const getOptions = (porcentaje: number) => ({
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
          { y: porcentaje, color: '#007bff' },
          { y: 100 - porcentaje, color: '#e0e0e0' },
        ],
      },
    ],
  });

  return (
    <div className="IECriticalFinding-container">
      {detallesFiltrados.map((detalle, index) => (
        <div key={index} className="critical-card">
          <div className="circular-bar">
            <div className="doughnut-chart">
              <HighchartsReact highcharts={Highcharts} options={getOptions(parseInt(detalle.field4))} />
            </div>
            <div className="critical-text">
              <p>{detalle.field1} - {detalle.field4}%</p>
            </div>
          </div>

          <div className="percentage-bars">
            <div className="bar green" style={{ width: `${detalle.field4}%` }}>
              <span className="question">{detalle.field3}</span>
            </div>
            <div className="bar yellow" style={{ width: `${detalle.field4}%` }}>
              <span className="percentage">{detalle.field4}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default IECriticalFindings;
