import './Average.css'

interface EvaluationItem {
  aspect: string;
  weight: string;
  gradeId: string;
  scoreId: string;
}

const evaluationData: EvaluationItem[] = [
  { aspect: 'INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES', weight: '4%', gradeId: 'nota-infraestructura', scoreId: 'puntaje-infraestructura' },
  { aspect: 'PROCEDIMIENTOS OP. DE SANITIZACION', weight: '25%', gradeId: 'nota-poes', scoreId: 'puntaje-poes' },
  { aspect: 'PROCEDIMIENTOS OP. DEL PROCESO', weight: '25%', gradeId: 'nota-poe', scoreId: 'puntaje-poe' },
  { aspect: 'MANEJO AMBIENTAL', weight: '4%', gradeId: 'nota-ma', scoreId: 'puntaje-ma' },
  { aspect: 'DOCUMENTACION', weight: '10%', gradeId: 'nota-doc', scoreId: 'puntaje-doc' },
  { aspect: 'TRAZADORES DE POSIBLE BROTE ETA', weight: '21%', gradeId: 'nota-traz', scoreId: 'puntaje-traz' },
  { aspect: 'LUMINOMETRIA', weight: '10%', gradeId: 'nota-lum', scoreId: 'puntaje-lum' },
];


const AverageModules: React.FC  = () => {


  return (
    <div className="audit-summary">
      <div className="table-responsive">
        <table id="tabla-auditoria" className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>N°</th>
              <th>ASPECTOS EVALUADOS</th>
              <th>PONDERACIÓN (%)</th>
              <th>NOTA POR ITEM</th>
              <th>PUNTAJE POR ITEM</th>
            </tr>
          </thead>
          <tbody id="audit-table-body">
            {evaluationData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.aspect}</td>
                <td>{item.weight}</td>
                <td>
                  <span className="nota-item" id={item.gradeId}>
                    0%
                  </span>
                </td>
                <td>
                  <span id={item.scoreId}>0%</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>PROMEDIO FINAL PONDERADO</td>
              <td>
                <span id="promedio-ponderado">0%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
export default AverageModules
