import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IETrazadores.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IETrazadoresProps {
  tablaDetails: TablaDetail[];
}

const extractPrefix = (field3: string) => {
  const match = field3.match(/^TRA [A-Z]+ \d+/);
  return match ? match[0] : '';
};

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

    const value = found ? parseInt(found.field4, 10) : 0;
    return isNaN(value) ? 0 : value;
  });

  // Validar que `filteredData` no esté vacío
  if (filteredData.length === 0) {
    return <div>No hay datos disponibles para mostrar.</div>;
  }

  // Cálculo del promedio
  const total = filteredData.reduce((sum, value) => sum + value, 0);
  const average = filteredData.length > 0 ? (total / filteredData.length).toFixed(2) : 'N/A';

  const dataWithColors = filteredData.map(value => ({
    y: value,
    color: getColorByPercentageIETrazadores(value)
  }));

  // Evitar problemas con `plotLines` si no hay datos válidos
  const plotLineValue = 90;
  const shouldRenderPlotLine = filteredData.some(value => value > 0);

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
      title: {
        text: 'Porcentaje'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray'
        }
      },
      plotLines: shouldRenderPlotLine ? [{
        color: 'black',
        width: 2,
        value: plotLineValue,
        dashStyle: 'Solid',
        zIndex: 5,
        label: {
          text: `Meta ${plotLineValue}%`,
          align: 'left',
          style: {
            color: 'black',
            fontWeight: 'bold'
          }
        }
      }] : []
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
        {categories.map((category, index) => (
          <div key={index} className="card-trazadores">
            <h3>{category}</h3>
            <p>Porcentaje: {filteredData[index]}%</p>
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
