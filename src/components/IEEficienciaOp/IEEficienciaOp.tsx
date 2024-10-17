import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IEEficienciaOp.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IEEficienciaOpProps {
  tablaDetails: TablaDetail[];
}

const extractPrefix = (field3: string) => {
  const match = field3.match(/^TRA [A-Z]+ \d+/);
  return match ? match[0] : '';
};


const IEEficienciaOp: React.FC<IEEficienciaOpProps> = ({ tablaDetails }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);

  const handleResize = () => {
    const newWidth = window.innerWidth * 0.8;
    setChartWidth(newWidth > 400 ? newWidth : 400);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const categories = [
    'RL 6. Cuenta con registros de mantención correctiva de equipos:',
    'PPT 83. Se cuenta con procedimientos escritos de los procesos (Formulación del producto, flujos de operación, procesos productivos). (Art. 3, 11, 63, 66, 69, 132)',
    'DOC 95. Autorizaciones Sanitarias (casino y verduras crudas):',
    'RL 6. Cuenta con registros de mantención correctiva de equipos:',
    'CQA 8. Almacenamiento de productos químicos según PH, con hojas de seguridad y EPP disponibles:',
    'REC 41. Verificar tiempo de exposición de materias primas a Tª adecuada:',
    'ALM 51. Verificar entrega correcta a la producción (verificación de cantidad, calidad y disponibilidad):',
    'SER 73. Reposición continua de las preparaciones frías y calientes:'
  ];


  const filteredData = categories.map(category => {
    const prefix = extractPrefix(category);
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === prefix);
    return found ? parseInt(found.field4) : 0;
  });


  const efficiencyCards = categories.map((category, index) => {
    let className = '';
  
    switch (index) {
      case 0:
        className = 'mantenciones';
        break;
      case 1:
        className = 'procedimientos';
        break;
      case 2:
        className = 'resoluciones';
        break;
      case 3:
        className = 'mantenciones'; // Repeated category
        break;
      case 4:
        className = 'almacenamiento';
        break;
      case 5:
        className = 'control-temperatura';
        break;
      case 6:
        className = 'planificacion';
        break;
      case 7:
        className = 'reposicion';
        break;
      default:
        className = 'default';
    }
  
    return {
      name: category,
      percentage: filteredData[index],
      className
    };
  });
  

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70,
        viewDistance: 25
      },
      width: chartWidth,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: categories.map(category => category.split(' ')[0]),
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
        name: 'Eficiencia',
        data: filteredData,
        colorByPoint: true,
        colors: [
          '#1E90FF', '#32CD32', '#FF4500', '#FFD700', '#8A2BE2', '#FF69B4', '#20B2AA', '#FF6347'
        ],
      }
    ],
    plotOptions: {
      column: {
        depth: 25,
        dataLabels: {
          enabled: true,
          format: '{y}%',
        }
      }
    }
  };

  return (
    <div className="ie-eficiencia-container">

      <div className="ie-eficiencia-grafico">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      <div className="ie-eficiencia-cards">
        {efficiencyCards.map((card, index) => (
          <div key={index} className={`eficiencia-card ${card.className}`}>
            {card.name}: {card.percentage}%
          </div>
        ))}
      </div>

    </div>
  );
}

export default IEEficienciaOp;
