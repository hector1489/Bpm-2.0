import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IESeguridad.css';

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IESeguridadProps {
  tablaDetails: TablaDetail[];
}

Highcharts3D(Highcharts);

const extractPrefix = (field3: string) => {
  const match = field3.match(/^TRA [A-Z]+ \d+/);
  return match ? match[0] : '';
};

const extractPercentage = (field4: string) => {
  const match = field4.match(/^(\d+)%/);
  return match ? match[1] : '';
};

const chartColors = {
  controlPlagas: '#17202a',
  controlesProcesos: '#16a085',
  reclamoProveedores: '#e74c3c',
  noConformidades: '#f1c40f',
  controlQuimicos: '#2874a6',
  tomaContramuestras: '#95a5a6',
};

const IESeguridad: React.FC<IESeguridadProps> = ({ tablaDetails }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);

  const handleResize = () => {
    const newWidth = window.innerWidth * 0.8;
    setChartWidth(newWidth > 300 ? newWidth : 300);
  };

  const IESeguridadData = [
    { text: 'CP 34. Revisar programa y evaluar eficacia y eficiencia', color: chartColors.controlPlagas },
    { text: 'RL 5. Mantención de registros de control de proceso, 90 días:', color: chartColors.controlesProcesos },
    { text: 'TRA SER 72. Equipos suficientes para la correcta mantención de productos calientes y fríos:', color: chartColors.reclamoProveedores },
    { text: 'ALM 48. Productos No Conforme, manejo correcto (art. 105 DS977):', color: chartColors.noConformidades },
    { text: 'CQA 10. Productos químicos y utensilios de aseo en cantidad y limpieza adecuada:', color: chartColors.controlQuimicos },
    { text: 'QQ 81. Verificar registro y toma de contramuestras, considerar menú y gramaje (100 a 200 gramos):', color: chartColors.tomaContramuestras },
  ];

  const updatedData = IESeguridadData.map((item) => {
    const prefix = extractPrefix(item.text);
    const found = tablaDetails.find((detail) => extractPrefix(detail.field3) === prefix);
    return {
      ...item,
      percentage: found ? `${extractPercentage(found.field4)}%` : '0%',
      y: found ? parseInt(extractPercentage(found.field4)) : 0,
    };
  });

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      width: chartWidth
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        innerSize: '35%',
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 40,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        }
      }
    },
    series: [{
      name: 'Porcentaje',
      colorByPoint: true,
      data: updatedData.map((item) => ({
        name: item.text.split('.')[0],
        y: item.y,
        color: item.color
      }))
    }]
  };

  return (
    <div className="ie-seguridad-container">
      <div className="seguridad-cards">
        {updatedData.map((item, index) => (
          <div 
            key={index} 
            className="seguridad-card" 
            style={{ backgroundColor: item.color }}
          >
            <p>{item.text}</p>
            <p>{item.percentage}</p>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
};

export default IESeguridad;
