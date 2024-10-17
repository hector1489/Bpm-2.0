import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import Cylinder from 'highcharts/modules/cylinder';
import './IEHigiene.css';

Highcharts3D(Highcharts);
Cylinder(Highcharts);

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IEHigieneProps {
  tablaDetails: TablaDetail[];
}


const extractPrefix = (field3: string) => {
  const match = field3.match(/^(LUM|CS|PRE) \d+/)
  return match ? match[0] : '';
};

const IEHigiene: React.FC<IEHigieneProps> = ({ tablaDetails }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);

  const handleResize = () => {
    const newWidth = window.innerWidth * 0.8;
    setChartWidth(newWidth > 400 ? newWidth : 400);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Categorías que se quieren mostrar en el gráfico
  const categories = [
    'LUM 21. Toma de muestra y uso de luminómetro:',
    'CS 13. Limpieza y desinfección de equipos de proceso (máquina universal, juguera, amasadora, otros):',
    'CS 12. Aplicación de procedimiento de higiene de tablas, cuchillos y mesones:',
    'PRE 56. Sanitizado con concentración y tiempo correctos. Verificar registro si aplica:'
  ];

  const filteredData = categories.map(category => {
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === category.split(' ')[0]);
    return found ? parseInt(found.field4) : 100;
  });

  const hygieneCards = [
    { name: 'LUMINOMETRIA LUM 21', percentage: filteredData[0], color: 'red' },
    { name: 'LIMPIEZA EQUIPOS CS 13', percentage: filteredData[1], color: 'yellow' },
    { name: 'LIMPIEZA UTENSILIOS CS 12', percentage: filteredData[2], color: 'blue' },
    { name: 'SANITIZACION GRAL PRE 56', percentage: filteredData[3], color: 'green' }
  ];

  const options = {
    chart: {
      type: 'cylinder',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25
      },
      width: chartWidth
    },
    title: {
      text: 'Evaluación de Higiene'
    },
    plotOptions: {
      series: {
        depth: 25,
        cylinder: {
          edgeColor: '#ffffff'
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y} %'
        }
      }
    },
    xAxis: {
      categories: categories.map(cat => cat.split('.')[0]),
      title: {
        text: null
      },
      labels: {
        style: {
          color: '#000'
        }
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      tickInterval: 20,
      title: {
        text: '% de cumplimiento'
      }
    },
    series: [{
      name: 'Cumplimiento',
      data: filteredData,
      colorByPoint: true,
      colors: ['#FF0000', '#FFFF00', '#0000FF', '#00FF00']
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="ie-higiene-container">

      <div className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>

      <div className="cards-higiene-ie">
        {hygieneCards.map((card, index) => (
          <div key={index} className={`card-higiene ${card.color}`}>
            <p>{card.name}</p>
            <p>{card.percentage}%</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default IEHigiene;
