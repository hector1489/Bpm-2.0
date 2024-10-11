import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IETrazadores.css';

const IETrazadores: React.FC = () => {

  const options = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
    },
    title: {
      text: '', // Sin título
    },
    xAxis: {
      categories: ['TRA CS 17', 'TRA CSH 29', 'TRA CSH 31', 'TRA PRE 52', 'TRA ELB 60', 'TRA ELB 66', 'TRA MA 67', 'TRA TPO 68', 'TRA SER 72', 'TRA DOC 98', 'TRA DOC 99'],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Porcentaje'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray' // Puedes definir un color por defecto
        }
      }
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [
      {
        name: 'Azul',
        data: [40, 35, 50, 45, 60, 70, 65, 50, 45, 60, 55],
        color: '#4a90e2'
      },
      {
        name: 'Verde',
        data: [30, 25, 20, 25, 20, 10, 15, 20, 25, 20, 25],
        color: '#7ed321'
      },
      {
        name: 'Rojo',
        data: [30, 40, 30, 30, 20, 20, 20, 30, 30, 20, 20],
        color: '#d0021b'
      }
    ]
  };

  return (
    <div className="trazadores-ie-container">
      <div className="chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default IETrazadores;
