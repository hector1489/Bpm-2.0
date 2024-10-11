import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IEIndicadores.css';

const IEIndicadoresClave: React.FC = () => {

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
    },
    title: {
      text: '', // Sin título
    },
    xAxis: {
      categories: ['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD', 'CAPACITACIONES'],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Porcentaje'
      },
    },
    series: [
      {
        name: 'Indicadores',
        data: [70, 85, 60, 90, 75],
        colorByPoint: true,
        colors: ['#000000', '#28a745', '#dc3545', '#ffc107', '#007bff'],
      }
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{y}%',
        }
      }
    }
  };

  return (
    <div className="ie-indicadores-container">
      <div className="indicadores-head">
        {/* Reemplazamos las barras con el gráfico de Highcharts */}
        <div className="indicadores-bars">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <div className="indicadores-icons">
          <div className="indicador-icon">BPM</div>
          <div className="indicador-icon">MINUTA</div>
          <div className="indicador-icon">EXÁMENES</div>
          <div className="indicador-icon">INAPTITUD MICROBIOLÓGICA</div>
          <div className="indicador-icon">CAPACITACIONES</div>
        </div>
      </div>
      <div className="indicadores-footer">
        <div className="indicadores-circular">
          <div className="circular graph black">
            <i className="fa-solid fa-feather-pointed"></i>
          </div>
          <div className="circular graph green">
            <i className="fa-solid fa-gears"></i>
          </div>
          <div className="circular graph red">
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="circular graph yellow">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="circular graph blue">
            <i className="fa-solid fa-pen-nib"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IEIndicadoresClave;
