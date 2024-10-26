import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import './BPMGraph.css';

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number | null }[];
}

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

const BPMGraph: React.FC<BPMGraphProps> = ({ moduleData }) => {
  const context = useContext(AppContext);
  const [nonApplicableModules, setNonApplicableModules] = useState<string[]>([]);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }
  
  const { state } = context;

  const bpmModules = ['infraestructura', 'legales'];
  const poesModules = [
    'poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada',
    'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'
  ];
  const poeModules = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
  ];
  const maModules = ['MA'];
  const docModules = ['doc'];

  const traModules = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
  ];

  const calcularPromedioGrupo = (modulos: string[]) => {
    const modulosDelGrupo = moduleData.filter((mod) => modulos.includes(mod.moduleName));
    
    const nonApplicable = modulosDelGrupo
      .filter((mod) => mod.percentage === null)
      .map((mod) => mod.moduleName);
    
    if (nonApplicable.length > 0) {
      setNonApplicableModules((prev) => [...prev, ...nonApplicable]);
    }

    const total = modulosDelGrupo.reduce((acc, curr) => acc + (curr.percentage ?? 100), 0);
    return modulosDelGrupo.length > 0 ? total / modulosDelGrupo.length : 100;
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  };

  const lumQuestion = ['LUM 21. Toma de muestra y uso de luminómetro:'];

  const lumData = state.IsHero
    .filter((question) => lumQuestion.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      let percentage = 0;

      if (answer !== 'N/A' && answer !== null) {
        const percentageMatch = answer.match(/^\d+/);
        percentage = percentageMatch ? parseInt(percentageMatch[0], 10) : 0;
      }

      return {
        question: question.question,
        shortQuestion: 'LUM 21',
        percentage,
        isNotApplicable: answer === 'N/A' || answer === null,
      };
    });

  const percentagesLum = lumData.map((data) => data.percentage);
  const lumAverage = percentagesLum.length > 0
    ? percentagesLum.reduce((acc, value) => acc + value, 0) / percentagesLum.length
    : 100;

  const groupedData = useMemo(() => [
    { groupName: 'BPM', average: calcularPromedioGrupo(bpmModules) },
    { groupName: 'POES', average: calcularPromedioGrupo(poesModules) },
    { groupName: 'POE', average: calcularPromedioGrupo(poeModules) },
    { groupName: 'MA', average: calcularPromedioGrupo(maModules) },
    { groupName: 'DOC', average: calcularPromedioGrupo(docModules) },
    { groupName: 'LUM', average: lumAverage },
    { groupName: 'TRA', average: calcularPromedioGrupo(traModules) },
  ], [moduleData]);

  const overallAverage = useMemo(() => {
    const applicableModules = moduleData.filter((mod) => mod.percentage !== null);
    return applicableModules.reduce((acc, curr) => acc + (curr.percentage ?? 100), 0) / applicableModules.length;
  }, [moduleData]);

  const groupNames = groupedData.map((group) => group.groupName).concat('PROM');
  const groupAverages = groupedData.map((group) => group.average).concat(overallAverage);
  const barColors = groupAverages.slice(0, -1).map((avg) => getColorByPercentage(avg)).concat(getColorByPercentage(overallAverage));

  const chartOptions = {
    chart: {
      type: 'column',
      renderTo: 'container',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
      reflow: true,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: groupNames,
      title: {
        text: '',
      },
    },
    yAxis: {
      title: {
        text: 'Porcentaje (%)',
      },
    },
    series: [
      {
        name: 'Promedio',
        data: groupAverages,
        colorByPoint: true,
        colors: barColors,
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
          inside: false,
          style: {
            fontWeight: 'bold',
            color: 'black',
          },
        },
      },
    ],
    plotOptions: {
      column: {
        depth: 25,
      },
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              options3d: {
                depth: 30,
              },
            },
            yAxis: {
              title: {
                text: null,
              },
            },
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bpm-graph-container">
      <h3>Grupos BPM.</h3>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
      {nonApplicableModules.length > 0 && (
        <div className="na-modules">
          <p>Módulos no aplicables ('N/A') o sin datos:</p>
          <ul>
            {nonApplicableModules.map((module, index) => (
              <li key={index}>{module}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BPMGraph;
