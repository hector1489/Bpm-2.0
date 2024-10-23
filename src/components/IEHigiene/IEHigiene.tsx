import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IEHigiene.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IEHigieneProps {
  tablaDetails: TablaDetail[];
}

const extractPrefix = (field3: string) => {
  const match = field3.match(/^(LUM|CS|PRE) \d+/);
  return match ? match[0] : '';
};

const extractPercentage = (field4: string) => {
  const match = field4.match(/^(\d+)%/);
  return match ? match[1] : '';
};

const chartColors = {
  luminometria: '#c0392b',
  limpiezaEquipos: '#f1c40f',
  limpiezaUtensilios: '#2e86c1',
  sanitizacionGral: '#28b463',
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

  const IEHigieneData = [
    { text: 'LUM 21. Toma de muestra y uso de luminómetro:', color: chartColors.luminometria },
    { text: 'CS 13. Limpieza y desinfección de equipos de proceso (máquina universal, juguera, amasadora, otros):', color: chartColors.limpiezaEquipos },
    { text: 'CS 12. Aplicación de procedimiento de higiene de tablas, cuchillos y mesones:', color: chartColors.limpiezaUtensilios },
    { text: 'PRE 56. Sanitizado con concentración y tiempo correctos. Verificar registro si aplica:', color: chartColors.sanitizacionGral },
  ];

  const updatedData = IEHigieneData.map((item) => {
    const prefix = extractPrefix(item.text);
    const found = tablaDetails.find((detail) => extractPrefix(detail.field3) === prefix);
    return {
      ...item,
      percentage: found ? `${extractPercentage(found.field4)}%` : '0%',
      y: found ? parseInt(extractPercentage(found.field4)) : 0,
    };
  });

  // Calcular el promedio de los porcentajes
  const total = updatedData.reduce((sum, item) => sum + item.y, 0);
  const average = (total / updatedData.length).toFixed(2);

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      width: chartWidth,
    },
    title: {
      text: 'Evaluación de Higiene'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
      name: 'Cumplimiento',
      colorByPoint: true,
      data: updatedData.map((item) => ({
        name: item.text.split('.')[0],
        y: item.y,
        color: item.color,
      }))
    }]
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
        {updatedData.map((item, index) => (
          <div key={index} className="card-higiene" style={{ backgroundColor: item.color }}>
            <p>{item.text}</p>
            <p>{item.percentage}</p>
          </div>
        ))}
      </div>

      <div className="average-higiene">
        <p>Promedio total de los porcentajes: {average}%</p>
      </div>
    </div>
  );
};

export default IEHigiene;
