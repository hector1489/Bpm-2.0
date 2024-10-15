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
      module: 'TRA CS', question: [
        "TRA CS 17. Aplicacion y eficiencia del programa de higiene, publicado e implementado por áreas (Art. 41, 43, 44, 64, 69):",
      ]
    },
    {
      module: 'TRA CSH', question: [
        "TRA CSH 29. Lavado y sanitizado correcto de manos y uñas:"
      ]
    },
    {
      module: 'TRA CSH', question: [
        "TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):",
      ]
    },
    {
      module: 'TRA PRE', question: [
        "TRA PRE 52. Verificar descongelación en equipos de refrigeración, en agua corriendo sólo en caso de emergencias:",
      ]
    },
    {
      module: 'TRA ELB', question: [
        "TRA ELB 60. Respetan las T° y los tiempos correctos de cocción y enfriamiento (fríos y calientes):",
      ]
    },
    {
      module: 'TRA ELB', question: [
        "TRA ELB 66. Tiempo entre elaboración y consumo:",
      ]
    },
    {
      module: 'TRA MA', question: [
        "TRA MA 67. Control de tiempo y Tº del equipo, al inicio y término de la mantención en frío o caliente:",
      ]
    },
    {
      module: 'TRA TPO', question: [
        "TRA TPO 68. Traslado de alimentos cumpliendo; protección, rotulación, estiba y registros al inicio y término:",
      ]
    },
    {
      module: 'TRA SER', question: [
        "TRA SER 72. Equipos suficientes para la correcta mantención de productos calientes y fríos:",
      ]
    },
    {
      module: 'TRA DOC', question: [
        "TRA DOC 98. Informes de auditoría sanitaria, plan de acción, verificación de cumplimiento, por Administrador:",
      ]
    },
    {
      module: 'TRA DOC', question: [
        "TRA DOC 99. Registros del cumplimiento al 100% del programa de charlas en Calidad y Medio Ambiente:",
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
      <table id="eta-warning-table" className="eta-table">
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
