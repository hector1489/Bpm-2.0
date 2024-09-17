import './Summary.css'

const Summary: React.FC = () => {

  return (
    <div className="ficha-resumen-container">
      <div className="ficha-resumen-table">
        <table>
          <thead>
            <tr>
              <th>Nombre de Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>N° de Auditoría:</th>
              <td>
                <span id="resumen-numero-auditoria" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>P° de Luminometría:</th>
              <td>
                <span id="resumen-lum" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>Gerente de Establecimiento:</th>
              <td>
                <span id="resumen-gerente-establecimiento" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>Administrador de Establecimiento:</th>
              <td>
                <span id="resumen-administrador-establecimiento" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>Supervisor del Establecimiento:</th>
              <td>
                <span id="resumen-supervisor-establecimiento" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>Auditor Externo:</th>
              <td>
                <span id="resumen-auditor-externo" className="resumen-span"></span>
              </td>
            </tr>
            <tr>
              <th>Fecha:</th>
              <td>
                <span id="resumen-fecha-auditoria" className="resumen-span"></span>
              </td>
            </tr>
          </thead>
        </table>
      </div>

      <div className="puntaje-ponderado">
        <h4 className="puntaje-promedio">
          Promedio General: <span id="promedio-general">0%</span>
        </h4>
        <div className="indicadores">
          <div className="indicador cumple">
            CUMPLE 90% - 100%
          </div>
          <div className="indicador alerta">
            EN ALERTA 75% - 89%
          </div>
          <div className="indicador critico">
            CRÍTICO 0% - 74%
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summary
