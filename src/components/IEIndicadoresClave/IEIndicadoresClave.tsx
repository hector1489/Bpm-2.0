import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IEIndicadores.css';
import {
  questionsMA,
  questionsDOC,
  questionsTra,
  questionLum,
  infraestructuraQuestions,
  legalesQuestions,
  poesControlProductosQuestion,
  poesAguaQuestion,
  poesSuperficiesQuestions,
  poesContaminacionCruzadaQuestions,
  poesSustanciasAdulterantes,
  poesHigieneEmpleadosQuestions,
  poesControlPlagas,
  poesInstalacionesQuestions,
  poeRecepcionQuestions,
  poeAlamacenaminetoQuestions,
  poePreelaboracionesQuestions,
  poeElaboracionesQuestions,
  poeTransporteQuestions,
  poeServicioQuestions,
  poeLavadoOllasQuestions,
  poeControlCalidadQiestions,
  poePptQuestions,
} from '../../utils/ConstModules'

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

type ModuleGroupName = 'BPM' | 'POES' | 'POE' | 'MA' | 'DOC' | 'LUM' | 'TRA';

const ponderaciones: Record<ModuleGroupName, number> = {
  BPM: 4,
  POES: 25,
  POE: 25,
  MA: 4,
  DOC: 10,
  LUM: 10,
  TRA: 21
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

  // Function to calculate a specific submodule's average with error handling
  const calculateGeneralAverage = (percentages: number[]): string => {
    const validPercentages = percentages.filter(value => !isNaN(value));
    const total = validPercentages.reduce((acc, percentage) => acc + percentage, 0);
    return validPercentages.length > 0 ? (total / validPercentages.length).toFixed(2) : 'N/A';
  };

  // Filtra y convierte datos de un submódulo específico
  const calculateSubmoduleAverageBpm = (submoduleQuestions: string[]): string => {
    const submoduleData = tablaDetails
      .filter(data => submoduleQuestions.includes(data.field3))
      .map(data => parseFloat(data.field3.replace('%', '')) || 0);
    return calculateGeneralAverage(submoduleData);
  };

  const filterModuleData = (questions: string[]): number[] => {
    return tablaDetails
      .filter(data => questions.includes(data.field3))
      .map(data => {
        const percentage = parseFloat(data.field4.replace('%', ''));
        return isNaN(percentage) ? NaN : percentage;
      })
      .filter(value => !isNaN(value));
  };

  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = filterModuleData(submoduleQuestions);
    return calculateGeneralAverage(submoduleData);
  };


  const calculateBPM = (): string => {
    const infraAverage = parseFloat(calculateSubmoduleAverageBpm(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverageBpm(legalesQuestions));

    const validAverages = [infraAverage, legalesAverage].filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  };

  const calculatePOES = () => {
    const poesAverages = [
      calculateSubmoduleAverage(poesControlProductosQuestion),
      calculateSubmoduleAverage(poesAguaQuestion),
      calculateSubmoduleAverage(poesSuperficiesQuestions),
      calculateSubmoduleAverage(poesContaminacionCruzadaQuestions),
      calculateSubmoduleAverage(poesSustanciasAdulterantes),
      calculateSubmoduleAverage(poesHigieneEmpleadosQuestions),
      calculateSubmoduleAverage(poesControlPlagas),
      calculateSubmoduleAverage(poesInstalacionesQuestions),
    ].map(avg => parseFloat(avg)).filter(avg => !isNaN(avg));

    const total = poesAverages.reduce((acc, avg) => acc + avg, 0);
    return poesAverages.length > 0 ? (total / poesAverages.length).toFixed(2) : 'N/A';
  };


  const calculatePOE = () => {
    const poeAverages = [
      calculateSubmoduleAverageBpm(poeRecepcionQuestions),
      calculateSubmoduleAverageBpm(poeAlamacenaminetoQuestions),
      calculateSubmoduleAverageBpm(poePreelaboracionesQuestions),
      calculateSubmoduleAverageBpm(poeElaboracionesQuestions),
      calculateSubmoduleAverageBpm(poeTransporteQuestions),
      calculateSubmoduleAverageBpm(poeServicioQuestions),
      calculateSubmoduleAverageBpm(poeLavadoOllasQuestions),
      calculateSubmoduleAverageBpm(poeControlCalidadQiestions),
      calculateSubmoduleAverageBpm(poePptQuestions)
    ].map(avg => parseFloat(avg)).filter(avg => !isNaN(avg));

    const total = poeAverages.reduce((acc, avg) => acc + avg, 0);
    return poeAverages.length > 0 ? (total / poeAverages.length).toFixed(2) : 'N/A';
  };

  const calculateMA = () => calculateGeneralAverage(filterModuleData(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleData(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleData(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleData(questionsTra));

  const groupedData = useMemo(() => [
    { groupName: 'BPM', percentage: ponderaciones.BPM, average: calculateBPM(), ponderacion: ponderaciones['BPM'] },
    { groupName: 'POES', percentage: ponderaciones.POES, average: calculatePOES(), ponderacion: ponderaciones['POES'] },
    { groupName: 'POE', percentage: ponderaciones.POE, average: calculatePOE(), ponderacion: ponderaciones['POE'] },
    { groupName: 'MA', percentage: ponderaciones.MA, average: calculateMA(), ponderacion: ponderaciones['MA'] },
    { groupName: 'DOC', percentage: ponderaciones.DOC, average: calculateDOC(), ponderacion: ponderaciones['DOC'] },
    { groupName: 'TRA', percentage: ponderaciones.TRA, average: calculateTRA(), ponderacion: ponderaciones['TRA'] },
    { groupName: 'LUM', percentage: ponderaciones.LUM, average: calculateLUM(), ponderacion: ponderaciones['LUM'] },
  ], [tablaDetails]);

  const finalAverageBPM = useMemo(() => {
    const validAverages = groupedData.map(group => parseFloat(group.average)).filter(avg => !isNaN(avg));

    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  }, [groupedData]);

  const bpmPercentage = parseFloat(finalAverageBPM) || 0;

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
    title: {
      text: '',
    },
    xAxis: { categories: ['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD MICROBIOLOGICA', 'CAPACITACIONES'] },
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
          {['BPM', 'MINUTA', 'EXÁMENES', 'INAPTITUD MICROBIOLOGICA', 'CAPACITACIONES'].map((label, index) => (
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
