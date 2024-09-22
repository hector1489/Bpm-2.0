import './ETAGraph.css'
import Plot from 'react-plotly.js'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'

interface BPMGraphProps {
  moduleData: { moduleName: string, percentage: number }[];
}

const ETAGraph: React.FC<BPMGraphProps> = () => {
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

  const questionsEta = [
    'CS 19. Los registros generados son coherentes con lo especificado en el programa (Art. 69):',
    'CS 20. Se adoptan las medidas necesarias para evitar la contaminación de los equipos después de limpiarse y desinfectarse (Art. 42):',
    'CSH 32. Existe un programa de higiene del personal y sus registros correspondientes. (Art. 55, 56, 60, 69)',
    'CP 35. La empresa a cargo del programa de aplicación de agentes químicos o biológicos para el control de plagas cuenta con Autorización sanitaria. (Art. 48):',
    'CP 36. Los desechos se disponen de forma de impedir el acceso y proliferación de plagas. (Art. 40):',
    'REC 42. Las materias primas utilizadas provienen de establecimientos autorizados y debidamente rotuladas y/o identificadas. (Art. 61, 96)',
    'REC 43. Se cuenta con las especificaciones escritas para cada materia prima (condiciones de almacenamiento, duración, uso, etc.)',
    'PPT 82. El flujo del personal, vehículos y de materias primas en las distintas etapas del proceso, es ordenado y conocido por todos los que participan en la elaboración, para evitar contaminación cruzada. (Art. 63)',
    'PPT 83. Se cuenta con procedimientos escritos de los procesos (Formulación del producto, flujos de operación, procesos productivos). (Art. 3, 11, 63, 66, 69, 132)',
    'PPT 84. Los productos se almacenan en condiciones que eviten su deterioro y contaminación (envases, temperatura, humedad, etc.). (Art.11, 67)',
    'PPT 85. La distribución de los productos terminados se realiza en vehículos autorizados, limpios y en buen estado. (Art. 11, 68)',
    'PPT 86. Para envasar los productos se utilizan materiales adecuados, los cuales son mantenidos en condiciones que eviten su contaminación. (Art. 11, 123)',
    'PPT 87. Los productos se etiquetan de acuerdo a las exigencias reglamentarias. (Art. 107 al 121)',
    'CAP 101. Existe un programa escrito y con sus registros correspondientes de capacitación del personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69)',
    'CAP 102. Existe un programa escrito de capacitación del personal de aseo en técnicas de limpieza y sus registros correspondientes. (Art. 41, 69)'
  ];

  const etaData = state.IsHero
    .filter((question) => questionsEta.includes(question.question))
    .map((question) => {
      const answer = question.answer ?? '';
      const percentageMatch = answer.match(/^\d+/);
      const percentage = percentageMatch ? parseInt(percentageMatch[0]) : 0;

      const shortQuestionName = question.question.split('.')[0] + '.';

      return {
        question: question.question,
        shortQuestion: shortQuestionName,
        percentage: percentage,
      };
    });

  const questionNames = etaData.map((data) => data.shortQuestion);
  const percentages = etaData.map((data) => data.percentage);

  return (
    <div className="eta-graph-container">
      <h4>Gráfico de Promedios en 3D ETA</h4>
      <Plot
        data={[
          {
            type: 'bar',
            x: questionNames,
            y: percentages,
            marker: {
              color: 'rgba(75, 192, 192, 0.6)',
            },
          },
        ]}
        layout={{
          title: 'Promedio de Respuestas por Pregunta ETA',
          scene: {
            xaxis: { title: 'Preguntas' },
            yaxis: { title: 'Porcentaje (%)' },
          },
          autosize: true,
          width: 800,
          height: 600,
        }}
      />
    </div>
  )
}
export default ETAGraph

