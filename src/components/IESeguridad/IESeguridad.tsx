import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IESeguridad.css';

Highcharts3D(Highcharts);

const chartColors = {
  controlPlagas: '#17202a',
  controlesProcesos: '#16a085',
  reclamoProveedores: '#e74c3c',
  noConformidades: '#f1c40f',
  controlQuimicos: '#2874a6',
  tomaContramuestras: '#95a5a6',
};

const IESeguridad: React.FC = () => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);

  const handleResize = () => {
    const newWidth = window.innerWidth * 0.8;
    setChartWidth(newWidth > 300 ? newWidth : 300);
  };

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
      data: [
        { name: 'Control de Plagas CP 34', y: 20, color: chartColors.controlPlagas },
        { name: 'Controles de Procesos RL 5', y: 10, color: chartColors.controlesProcesos },
        { name: 'Reclamo a Proveedores REC 72', y: 25, color: chartColors.reclamoProveedores },
        { name: 'No Conformidades Internas ALM 48', y: 15, color: chartColors.noConformidades },
        { name: 'Control Uso de Químicos CQ 10', y: 10, color: chartColors.controlQuimicos },
        { name: 'Toma Contramuestras QQ 81', y: 20, color: chartColors.tomaContramuestras }
      ]
    }]
  };

  return (
    <div className="ie-seguridad-container">
      <div className="seguridad-cards">
        <div className="seguridad-card black">
          <p>Control de Plagas CP 34</p>
          <p>20%</p>
        </div>
        <div className="seguridad-card green">
          <p>Controles de Procesos RL 5</p>
          <p>10%</p>
        </div>
        <div className="seguridad-card red">
          <p>Reclamo a Proveedores REC 72</p>
          <p>25%</p>
        </div>
        <div className="seguridad-card yellow">
          <p>No Conformidades Internas ALM 48</p>
          <p>15%</p>
        </div>
        <div className="seguridad-card blue">
          <p>Control Uso de Químicos CQ 10</p>
          <p>10%</p>
        </div>
        <div className="seguridad-card gray">
          <p>Toma Contramuestras QQ 81</p>
          <p>20%</p>
        </div>
      </div>

      <div className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
}

export default IESeguridad;
