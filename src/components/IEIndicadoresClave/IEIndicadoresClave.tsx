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
    const minWidth = 400;
    const maxWidth = 1000;
    setChartWidth(newWidth > maxWidth ? maxWidth : newWidth < minWidth ? minWidth : newWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD', 'CAPACITACIONES'];

  const filteredData = categories.map(category => {
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === category);
    return found && !isNaN(parseInt(found.field4)) ? parseInt(found.field4) : 'NA';
  });

  // Filtrar los valores válidos para el cálculo del promedio
  const validData = filteredData.filter(value => typeof value === 'number') as number[];
  const total = validData.reduce((sum, value) => sum + value, 0);
  const average = validData.length > 0 ? (total / validData.length).toFixed(2) : 'NA';

  // Definir los valores individuales, asignando 'NA' si el dato no es válido
  const bpm = filteredData[0] === 'NA' ? 'NA' : filteredData[0];
  const minuta = filteredData[1] === 'NA' ? 'NA' : filteredData[1];
  const examenes = filteredData[2] === 'NA' ? 'NA' : filteredData[2];
  const inaptitud = filteredData[3] === 'NA' ? 'NA' : filteredData[3];
  const capacitaciones = filteredData[4] === 'NA' ? 'NA' : filteredData[4];

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
        data: filteredData.map(value => (typeof value === 'number' ? value : 0)), // Asignamos 0 si es 'NA'
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
      </div>

      <div className="indicadores-footer">
        <div className="indicadores-circular">
          <div className="circular graph black">
            <p>BPM</p>
            <p>{bpm === 'NA' ? 'NA' : `${bpm}%`}</p>
          </div>
          <div className="circular graph green">
            <p>MINUTA</p>
            <p>{minuta === 'NA' ? 'NA' : `${minuta}%`}</p>
          </div>
          <div className="circular graph red">
            <p>EXÁMENES</p>
            <p>{examenes === 'NA' ? 'NA' : `${examenes}%`}</p>
          </div>
          <div className="circular graph yellow">
            <p>INAPTITUD MICROBIOLÓGICA</p>
            <p>{inaptitud === 'NA' ? 'NA' : `${inaptitud}%`}</p>
          </div>
          <div className="circular graph blue">
            <p>CAPACITACIONES</p>
            <p>{capacitaciones === 'NA' ? 'NA' : `${capacitaciones}%`}</p>
          </div>
        </div>
      </div>

      <div className="average-indicadores">
        <p>Promedio Total: {average === 'NA' ? 'NA' : `${average}%`}</p>
      </div>
    </div>
  );
};

export default IEIndicadoresClave;


