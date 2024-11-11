import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getColorByPercentage } from '../../utils/utils'
import './BPMGraph.css';
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


if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

export interface Answer {
  question: string;
  answer: string;
}

const BPMGraph: React.FC = () => {
  const context = useContext(AppContext);


  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

  if (!state) {
    return <div>Error al cargar el contexto</div>;
  }

  const filterModuleDetails = (submoduleQuestions: string[]): number[] => {
  
    const filteredData = state.IsHero
      ? state.IsHero
          .filter((IQuestion) => submoduleQuestions.some(q => q === IQuestion.question))
          .map((IQuestion) => {
            const answer = IQuestion.answer?.trim() || '';
            const match = answer.match(/^(\d+(\.\d+)?)%/);
  
            if (match) {
              const numValue = parseFloat(match[1]);

              return !isNaN(numValue) ? numValue : NaN;
            }

          
  
            return NaN; 
          })
          .filter(value => !isNaN(value)) 
      : [];

    return filteredData;
  };
  


  const calculateGeneralAverage = (percentages: number[]) => {
    const validPercentages = percentages.filter(value => !isNaN(value));
    const total = validPercentages.reduce((acc, percentage) => acc + percentage, 0);
    return validPercentages.length > 0 ? (total / validPercentages.length).toFixed(2) : 'N/A';
  };


  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = filterModuleDetails(submoduleQuestions);
    return calculateGeneralAverage(submoduleData);
  };

  const calculateBPM = () => {
    const infraAverage = parseFloat(calculateSubmoduleAverage(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverage(legalesQuestions));

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
      calculateSubmoduleAverage(poeRecepcionQuestions),
      calculateSubmoduleAverage(poeAlamacenaminetoQuestions),
      calculateSubmoduleAverage(poePreelaboracionesQuestions),
      calculateSubmoduleAverage(poeElaboracionesQuestions),
      calculateSubmoduleAverage(poeTransporteQuestions),
      calculateSubmoduleAverage(poeServicioQuestions),
      calculateSubmoduleAverage(poeLavadoOllasQuestions),
      calculateSubmoduleAverage(poeControlCalidadQiestions),
      calculateSubmoduleAverage(poePptQuestions)
    ].map(avg => parseFloat(avg)).filter(avg => !isNaN(avg));

    const total = poeAverages.reduce((acc, avg) => acc + avg, 0);
    return poeAverages.length > 0 ? (total / poeAverages.length).toFixed(2) : 'N/A';
  };

  const calculateMA = () => calculateGeneralAverage(filterModuleDetails(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleDetails(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleDetails(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleDetails(questionsTra));

  const groupedData = [
    { groupName: 'BPM', average: calculateBPM() },
    { groupName: 'POES', average: calculatePOES() },
    { groupName: 'POE', average: calculatePOE() },
    { groupName: 'MA', average: calculateMA() },
    { groupName: 'DOC', average: calculateDOC() },
    { groupName: 'TRA', average: calculateTRA() },
    { groupName: 'LUM', average: calculateLUM() },
  ];

  const finalAverage = useMemo(() => {
    const validAverages = groupedData.map(group => parseFloat(group.average)).filter(avg => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  }, [groupedData]);

  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
      reflow: true,
    },
    title: { text: 'Promedios por Módulo' },
    xAxis: { categories: [...groupedData.map(g => g.groupName), 'PROM'] },
    yAxis: { title: { text: 'Porcentaje (%)' } },
    series: [{
      name: 'Promedio',
      data: [...groupedData.map(g => parseFloat(g.average)), parseFloat(finalAverage)],
      colorByPoint: true,
      colors: [
        ...groupedData.map(g => getColorByPercentage(parseFloat(g.average))), 
        getColorByPercentage(parseFloat(finalAverage))
      ],
      dataLabels: { enabled: true, format: '{y:.1f}%', style: { fontWeight: 'bold', color: 'black' } },
    }],
  };
  

  return (
    <div className="bpm-graph-container">
      <h3>Grupos BPM.</h3>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
   
    </div>
  );
};

export default BPMGraph;
