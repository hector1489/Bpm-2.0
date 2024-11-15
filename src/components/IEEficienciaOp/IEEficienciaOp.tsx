import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IEEficienciaOp.css';
import {  extractPrefix } from '../../utils/utils'

Highcharts3D(Highcharts);

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IEEficienciaOpProps {
  tablaDetails: TablaDetail[];
}

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
    'PPT 82. El flujo del personal, vehículos y de materias primas en las distintas etapas del proceso, es ordenado y conocido por todos los que participan en la elaboración, para evitar contaminación cruzada. (Art. 63)',
    'PPT 83. Se cuenta con procedimientos escritos de los procesos (Formulación del producto, flujos de operación, procesos productivos). (Art. 3, 11, 63, 66, 69, 132)',
    'DOC 95. Autorizaciones Sanitarias (casino y verduras crudas):',
    'RL 6. Cuenta con registros de mantención correctiva de equipos:',
    'CQA 8. Almacenamiento de productos químicos según PH, con hojas de seguridad y EPP disponibles:',
    'REC 41. Verificar tiempo de exposición de materias primas a Tª adecuada:',
    'ALM 51. Verificar entrega correcta a la producción (verificación de cantidad, calidad y disponibilidad):',
    'SER 73. Reposición continua de las preparaciones frías y calientes:'
  ];

  const colors = [
    '#1E90FF', '#32CD32', '#FF4500', '#FFD700', '#8A2BE2', '#FF69B4', '#20B2AA', '#FF6347'
  ];

  const filteredData = categories.map(category => {
    const prefix = extractPrefix(category);
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === prefix);
    const value = found?.field4 === 'N/A' ? 'N/A' : parseInt(found?.field4 || '0');
    return value;
  });

  const efficiencyCards = categories.map((category, index) => ({
    name: category,
    percentage: filteredData[index],
    color: colors[index]
  }));

  const validData = filteredData.filter(value => typeof value === 'number') as number[];
  const total = validData.reduce((sum, value) => sum + value, 0);
  const average = validData.length > 0 ? (total / validData.length).toFixed(2) : 'N/A';
  
  

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
      categories: categories.map(category => category.split('.')[0]),
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
        data: filteredData.map(value => (typeof value === 'number' ? value : 0)),
        colorByPoint: true,
        colors
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
          <div key={index} className="eficiencia-card" style={{ backgroundColor: card.color }}>
            {card.name}: {card.percentage === 'N/A' ? 'N/A' : `${card.percentage}%`}
          </div>
        ))}
      </div>

      <div className="average-eficiencia">
        <p>Promedio Total: {average === 'N/A' ? 'N/A' : `${average}%`}</p>
      </div>
    </div>
  );
};

export default IEEficienciaOp;
