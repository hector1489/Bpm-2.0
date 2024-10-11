import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import Cylinder from 'highcharts/modules/cylinder';
import './IEHigiene.css';

Highcharts3D(Highcharts);
Cylinder(Highcharts);

const IEHigiene: React.FC = () => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8); // Set default width

  // Function to adjust the chart width based on window resize
  const handleResize = () => {
    const newWidth = window.innerWidth * 0.8; // Adjust chart width dynamically
    setChartWidth(newWidth > 400 ? newWidth : 400); // Set a minimum width of 400px
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      width: chartWidth // Set dynamic width for responsiveness
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
      categories: ['LUMINOMETRIA LUM 21', 'LIMPIEZA EQUIPOS CS 13', 'LIMPIEZA UTENSILIOS CS 12', 'SANITIZACION GRAL PRE 56'],
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
      data: [80, 60, 70, 90],
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
        <div className="card-higiene red">
          <p>LUMINOMETRIA LUM 21</p>
          <p>80%</p>
        </div>
        <div className="card-higiene yellow">
          <p>LIMPIEZA EQUIPOS CS 13</p>
          <p>60%</p>
        </div>
        <div className="card-higiene blue">
          <p>LIMPIEZA UTENSILIOS CS 12</p>
          <p>70%</p>
        </div>
        <div className="card-higiene green">
          <p>SANITIZACION GRAL PRE 56</p>
          <p>90%</p>
        </div>
      </div>

    </div>
  );
}

export default IEHigiene;
