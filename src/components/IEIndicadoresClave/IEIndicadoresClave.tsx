import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IEIndicadores.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IEIndicadoresClaveProps {
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

  const updatedData = tablaDetails.map((item) => {
    const prefix = extractPrefix(item.field3);
    const percentage = extractPercentage(item.field4);
    return {
      ...item,
      prefix,
      percentage: percentage ? `${percentage}%` : 'NA',
      y: percentage ? parseInt(percentage) : 0,
    };
  });

  const calculateGroupAverage = (questions: string[]) => {
    const percentages = questions
      .map((question) => {
        const detail = updatedData.find((item) => item.field3 === question);
        return detail ? parseInt(detail.percentage) : null;
      })
      .filter((percentage) => percentage !== null);

    if (percentages.length === 0) return null;
    const total = percentages.reduce((acc, val) => acc + val!, 0);
    return Math.round(total / percentages.length);
  };

  const bpmPercentage = calculateGroupAverage([
    "INF 1. Separaciones de áreas mínimas y condiciones de mantención de esta:",
    "INF 2. Equipos mínimos de cocción y frío (quemadores, refrigeradores, mantenedores, otros):",
    "INF 3. Cuenta con servicios básicos (agua potable, desagües, ventilación, luminarias, vestuarios, otros):",
    "RL 4. Es factible realizar trazabilidad de producto:",
    "RL 5. Mantención de registros de control de proceso, 90 días:",
    "RL 6. Cuenta con registros de mantención correctiva de equipos:",
    "RL 7. Inducción y entrenamiento al personal, en calidad y medio ambiente (registros e interrogar al personal):"
  ]);

  const doc97Detail = updatedData.find((item) => item.field3 === 'DOC 97. Informes de muestreo microbiológico/luminometría. Planes de acción, charlas al personal si corresponde:');
  const doc97Percentage = doc97Detail ? parseInt(doc97Detail.percentage) : 'NA';

  const csh31Detail = updatedData.find((item) => item.field3 === 'TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):');
  const csh31Percentage = csh31Detail ? parseInt(csh31Detail.percentage) : 'NA';

  const ser71Detail = updatedData.find((item) => item.field3 === 'SER 71. Variedad de alternativas instaladas en línea autoservicio, según menú (fondos, ensaladas y postres, otros):');
  const ser71Percentage = ser71Detail ? parseInt(ser71Detail.percentage) : 'NA';

  const cap101Detail = updatedData.find((item) => item.field3 === 'CAP 101. Existe un programa escrito y con sus registros correspondientes de capacitación del personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69)');
  const cap101Percentage = cap101Detail ? parseInt(cap101Detail.percentage) : 'NA';

  const validAverages = [bpmPercentage, doc97Percentage, csh31Percentage, ser71Percentage, cap101Percentage]
    .filter((val): val is number => typeof val === 'number');

  const average = validAverages.length > 0
    ? Math.round(validAverages.reduce((acc, val) => acc + val, 0) / validAverages.length)
    : 'NA';

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
        frame: { bottom: { size: 1, color: 'rgba(0,0,0,0.02)' } }
      },
      width: chartWidth,
    },
    xAxis: { categories: ['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD', 'CAPACITACIONES'] },
    yAxis: { min: 0, title: { text: 'Porcentaje' } },
    series: [{
      name: 'Indicadores',
      data: [bpmPercentage, ser71Percentage, csh31Percentage, doc97Percentage, cap101Percentage].map(val => (val === 'NA' ? 0 : val)),
      colorByPoint: true,
      colors: ['#000000', '#28a745', '#dc3545', '#ffc107', '#007bff']
    }],
    plotOptions: {
      column: { depth: 25, dataLabels: { enabled: true, format: '{y}%' } }
    }
  };

  return (
    <div className="ie-indicadores-container">
      <div className="indicadores-head">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      <div className="indicadores-footer">
        <div className="indicadores-circular">
          {['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD', 'CAPACITACIONES'].map((label, index) => (
            <div className={`circular graph ${['black', 'green', 'red', 'yellow', 'blue'][index]}`} key={label}>
              <p>{label}</p>
              <p>{[bpmPercentage, ser71Percentage, csh31Percentage, doc97Percentage, cap101Percentage][index] || 'NA'}%</p>
            </div>
          ))}
        </div>
      </div>
      <div className="average-indicadores">
        <p>Promedio Total: {average}%</p>
      </div>
    </div>
  );
};

export default IEIndicadoresClave;
