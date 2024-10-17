import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IEIndicadores.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IEIndicadoresClaveProps {
  tablaDetails: TablaDetail[];
}


const extractPrefix = (field3: string) => {
  const match = field3.match(/^[A-ZÁÉÍÓÚ]+/);
  return match ? match[0] : '';
};

const IEIndicadoresClave: React.FC<IEIndicadoresClaveProps> = ({ tablaDetails }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);


  const handleResize = () => {
    const newWidth = window.innerWidth * 0.8;
    setChartWidth(newWidth > 400 ? newWidth : 400);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const categories = ['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD', 'CAPACITACIONES'];


  const filteredData = categories.map(category => {
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === category);
    return found ? parseInt(found.field4) : 100;
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
        viewDistance: 25,
        frame: {
          bottom: {
            size: 1,
            color: 'rgba(0,0,0,0.02)'
          }
        }
      },
      width: chartWidth,
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
    },
    series: [
      {
        name: 'Indicadores',
        data: filteredData,
        colorByPoint: true,
        colors: ['#000000', '#28a745', '#dc3545', '#ffc107', '#007bff'],
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
    <div className="ie-indicadores-container">
      <div className="indicadores-head">
        
        <div className="indicadores-bars">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>

        <div className="indicadores-icons">
          <div className="indicador-icon">BPM</div>
          <div className="indicador-icon">MINUTA</div>
          <div className="indicador-icon">EXÁMENES</div>
          <div className="indicador-icon">INAPTITUD MICROBIOLÓGICA</div>
          <div className="indicador-icon">CAPACITACIONES</div>
        </div>

      </div>

      <div className="indicadores-footer">

        <div className="indicadores-circular">

          <div className="circular graph black">
            <i className="fa-solid fa-feather-pointed"></i>
          </div>
          <div className="circular graph green">
            <i className="fa-solid fa-gears"></i>
          </div>
          <div className="circular graph red">
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="circular graph yellow">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="circular graph blue">
            <i className="fa-solid fa-pen-nib"></i>
          </div>

        </div>

      </div>
    </div>
  );
}

export default IEIndicadoresClave;
