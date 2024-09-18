import { useContext } from 'react';
import './Summary.css';
import { AppContext } from '../../context/GlobalState';

const Summary: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const { auditSheetData } = context.state;

  return (
    <div className="ficha-resumen-container">

      <div className="ficha-resumen-table">
        <table>
          <thead>
            <tr>
              <th>Nombre del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.nombreEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Noumero de Auditoria:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.numeroAuditoria || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Gerente del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.gerenteEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Administrador del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.administradorEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Supervisor del Establecimiento:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.supervisorEstablecimiento || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Auditor Externo:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.auditorExterno || 'N/A'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Fecha:</th>
              <td>
                <span id="resumen-nombre-establecimiento" className="resumen-span">
                  {auditSheetData.fechaAuditoria || 'N/A'}
                </span>
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
  );
};

export default Summary;
