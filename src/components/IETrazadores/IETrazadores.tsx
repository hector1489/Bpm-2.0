import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IETrazadores.css';
import { extractPrefix, extractPercentage } from '../../utils/utils'

Highcharts3D(Highcharts);

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IETrazadoresProps {
  tablaDetails: TablaDetail[];
}

const getColorByPercentageIETrazadores = (percentage: number) => {
  
  if (percentage >= 75) {
    return '#2874a6';
  } else if (percentage >= 50) {
    return '#229954';
  } else {
    return '#cb4335';
  }
};

const IETrazadores: React.FC<IETrazadoresProps> = ({ tablaDetails }) => {

  if (!tablaDetails || tablaDetails.length === 0) {
  return <div>No hay datos disponibles para mostrar.</div>;
}

  const categories = [
    'TRA CS 17',
    'TRA CSH 29',
    'TRA CSH 31',
    'TRA PRE 52',
    'TRA ELB 60',
    'TRA ELB 66',
    'TRA MA 67',
    'TRA TPO 68',
    'TRA SER 72',
    'TRA DOC 98',
    'TRA DOC 99'
  ];

const filteredData = categories.map(category => {
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === category);
    const percentage = extractPercentage(found?.field4 || 'N/A');
    const value = percentage;

    return { category, value, found };
});

  if (filteredData.every(({ value }) => value === 0)) {
    return <div>No hay datos disponibles para mostrar.</div>;
  }

  const total = filteredData.reduce((sum, { value }) => sum + value, 0);
  const average = filteredData.length > 0 ? (total / filteredData.length).toFixed(2) : 'N/A';

  const dataWithColors = filteredData.map(({ value }) => ({
    y: value,
    color: getColorByPercentageIETrazadores(value)
  }));

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 50,
        viewDistance: 25
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      categories,
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      max: 100,
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
      plotLines: [
        {
          color: 'black',
          width: 2,
          value: 90,
          label: {
            text: 'Meta 90%',
            align: 'right',
            verticalAlign: 'middle',
            x: +55,
            style: {
              color: 'black',
              fontWeight: 'bold',
            },
          },
          zIndex: 5,
        },
      ],
    },
    plotOptions: {
      column: {
        depth: 25,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },
    series: [
      {
        name: 'Porcentaje',
        data: dataWithColors
      }
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          xAxis: {
            categories: ['TRA 17', 'TRA 29', 'TRA 31', 'TRA 52', 'TRA 60', 'TRA 66', 'TRA 67', 'TRA 68', 'TRA 72', 'TRA 98', 'TRA 99'],
            labels: {
              step: 1
            }
          },
          yAxis: {
            title: {
              text: null
            }
          },
        }
      }]
    }
  };

  return (
    <div className="trazadores-ie-container">
      <div className="chart-trazadores-ie">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      <div className="cards-trazadores">
        {filteredData.map(({  value, found }, index) => (
          <div key={index} className="card-trazadores">
            <h5>{found?.field3}</h5>
            <p>Porcentaje: {value}%</p>
          </div>
        ))}
      </div>

      <div className="average-trazadores">
        <p>Promedio Total : {average}%</p>
      </div>
    </div>
  );
}

export default IETrazadores;
