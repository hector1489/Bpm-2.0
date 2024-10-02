import React from 'react';
import './IncidentSummary.css';

const IncidentSummary: React.FC = () => {
  return (
    <div className="incident-summary-container">

      <div className="grid-container">
        <div className="summary-cards">
          <div className="summary-card animate__fadeInUp bordered-box total-incidencias">

            <div className="card-header bg-primary text-white text-center">
              <i className="fas fa-exclamation-circle text-warning"></i> Total Incidencias
            </div>

            <div className="card-body">
              <h5 className="card-title text-center"><span id="totalIncidencias">0</span></h5>
            </div>

          </div>

          <div className="summary-card animate__fadeInUp bordered-box estado-incidencias">

            <div className="card-header bg-primary text-white text-center">
              <i className="fas fa-tasks text-info"></i> Estado
            </div>

            <div className="card-body text-center">
              <p><i className="fas fa-exclamation text-warning"></i> <span id="estadoAbierto">0</span> Abiertos</p>
              <p><i className="fas fa-check text-success"></i> <span id="estadoCerrado">0</span> Cerrados</p>
              <p><i className="fas fa-times-circle text-danger"></i> <span id="fueraDePlazo-Head">0</span> Fuera de Plazo</p>
            </div>

          </div>
        </div>

        <div className="summary-card animate__fadeInUp bordered-box responsables">

          <div className="card-header bg-info text-white text-center">
            <i className="fas fa-users text-light"></i> Responsables y Total Cerrados
          </div>

          <div className="card-body">

            <table className="table table-hover">
              <tbody>
                <tr>
                  <td><i className="fas fa-user text-primary"></i>1-Gerente De Contrato</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-secondary"></i>2-Administrador</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-success"></i>3-Supervisor De Mantencion</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-danger"></i>4-Supervisor De Casino</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>5-Spervisor De Aseo</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>6-Coordinador De Calidad</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>7-Asesor SSO</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>8-Asesor Medio Ambiente</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>9-Jefe RH</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>10-Bodeguero</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><i className="fas fa-user text-warning"></i>11-Chef</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="summary-cards text-center animate__fadeInUp">

        <div className="card-header bg-light mt-4">
          <h4 className='text-uppercase'>Resumen de Incidencias</h4>
        </div>

        <div className="card-body resumen-grid">

          <div className="card bg-success text-white bordered-box">
            <div className="card-body">
              <h5><span id="criticidadLeve">0</span></h5>
              <p>Leve</p>
            </div>
          </div>

          <div className="card bg-warning text-white bordered-box">
            <div className="card-body">
              <h5><span id="criticidadModerado">0</span></h5>
              <p>Moderado</p>
            </div>
          </div>

          <div className="card bg-danger text-white bordered-box">
            <div className="card-body">
              <h5><span id="criticidadCritico">0</span></h5>
              <p>Crítico</p>
            </div>
          </div>

          <div className="card bg-warning text-white bordered-box">
            <div className="card-body">
              <h5><span id="cardEstadoAbierto">0</span></h5>
              <p>Abierta</p>
            </div>
          </div>

          <div className="card bg-success text-white bordered-box">
            <div className="card-body">
              <h5><span id="cardEstadoCerrado">0</span></h5>
              <p>Cerrada</p>
            </div>
          </div>

          <div className="card bg-red text-white bordered-box">
            <div className="card-body">
              <h5><span id="fueraDePlazo">0</span></h5>
              <p>Fuera de plazo</p>
            </div>
          </div>

          <div className="card bg-info text-white bordered-box">
            <div className="card-body">
              <h5><span id="cardNumeroAuditoria">0</span></h5>
              <p>Número de Auditoria</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default IncidentSummary;
