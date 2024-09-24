import './ETATable.css'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'

const ETATable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const questionsETA = [
    {
      module: 'CONTROL DE SUPERFICIES CONTACTO CON ALIMENTOS E INSTALACIONES', question: [
        "CS 19. Los registros generados son coherentes con lo especificado en el programa (Art. 69):",
        "CS 20. Se adoptan las medidas necesarias para evitar la contaminación de los equipos después de limpiarse y desinfectarse (Art. 42):"
      ]
    },
    {
      module: 'CONTROL DE SALUD E HIGIENE DE EMPLEADOS', question: [
        "CSH 32. Existe un programa de higiene del personal y sus registros correspondientes. (Art. 55, 56, 60, 69)"
      ]
    },
    {
      module: 'CONTROL DE PLAGAS', question: [
        "CP 35. La empresa a cargo del programa de aplicación de agentes químicos o biológicos para el control de plagas cuenta con Autorización sanitaria. (Art. 48):",
        "CP 36. Los desechos se disponen de forma de impedir el acceso y proliferación de plagas. (Art. 40):"
      ]
    },
    {
      module: 'RECEPCION', question: [
        "REC 42. Las materias primas utilizadas provienen de establecimientos autorizados y debidamente rotuladas y/o identificadas. (Art. 61, 96)",
        "REC 43. Se cuenta con las especificaciones escritas para cada materia prima (condiciones de almacenamiento, duración, uso, etc.)"
      ]
    },
    {
      module: 'PROCESOS Y PRODUCTOS TERMINADOS', question: [
        "PPT 82. El flujo del personal, vehículos y de materias primas en las distintas etapas del proceso, es ordenado y conocido por todos los que participan en la elaboración, para evitar contaminación cruzada. (Art. 63)",
        "PPT 83. Se cuenta con procedimientos escritos de los procesos (Formulación del producto, flujos de operación, procesos productivos). (Art. 3, 11, 63, 66, 69, 132)",
        "PPT 84. Los productos se almacenan en condiciones que eviten su deterioro y contaminación (envases, temperatura, humedad, etc.). (Art.11, 67)",
        "PPT 85. La distribución de los productos terminados se realiza en vehículos autorizados, limpios y en buen estado. (Art. 11, 68)",
        "PPT 86. Para envasar los productos se utilizan materiales adecuados, los cuales son mantenidos en condiciones que eviten su contaminación. (Art. 11, 123)",
        "PPT 87. Los productos se etiquetan de acuerdo a las exigencias reglamentarias. (Art. 107 al 121)"
      ]
    },
    {
      module: 'CAP - CAPACITACION', question: [
        "CAP 101. Existe un programa escrito y con sus registros correspondientes de capacitación del personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69)",
        "CAP 102. Existe un programa escrito de capacitación del personal de aseo en técnicas de limpieza y sus registros correspondientes. (Art. 41, 69)"
      ]
    },
  ]

  const getAnswerForQuestion = (questionText: string) => {
    const foundQuestion = state.IsHero.find(q => q.question === questionText);
    return foundQuestion ? foundQuestion.answer : "No hay observaciones.";
  }

  return (
    <div className="eta-table-container">
    <div className="legend">
      <span className="legend-item" style={{ color: 'green' }}>●</span> 90% - 100%: Cumplimiento alto <br />
      <span className="legend-item" style={{ color: 'yellow' }}>●</span> 75% - 89%: Cumplimiento medio <br />
      <span className="legend-item" style={{ color: 'red' }}>●</span> 0% - 74%: Cumplimiento bajo
    </div>
    <div className="table-responsive">
      <table id="tabla-warning" className="table-warning">
        <thead>
          <tr>
            <th>Items Evaluados</th>
            <th colSpan={5}>Preguntas Evaluadas</th>
            <th colSpan={5}>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {questionsETA.map((module, index) => (
            <tr key={index}>
              <td>{module.module}</td>
              <td colSpan={5}>
                {module.question.map((q, i) => (
                  <div key={i}>{q}</div>
                ))}
              </td>
              <td colSpan={5}>
                {module.question.map((q, i) => (
                  <div key={i}>{getAnswerForQuestion(q)}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default ETATable
