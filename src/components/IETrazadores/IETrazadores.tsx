import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IETrazadores.css';

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

const IETrazadores: React.FC<IETrazadoresProps> = ({ tablaDetails }) => {
  
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
    return found ? parseInt(found.field4) : 0;
  });

  const options = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
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
      plotLines: [{
        color: 'black',
        width: 2,
        value: 90,
        dashStyle: 'Solid',
        zIndex: 5,
        label: {
          text: 'Meta 90%',
          align: 'left',
          style: {
            color: 'black',
            fontWeight: 'bold'
          }
        }
      }]
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
        name: 'Porcentaje',
        data: filteredData,
        color: '#2874a6'
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
      <div className="chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default IETrazadores;
