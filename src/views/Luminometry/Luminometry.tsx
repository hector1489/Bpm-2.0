import { LUMGraph } from '../../components/index'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import './Luminometry.css'
import logos from '../../assets/img/index'

const logoDetails = logos.logoDetails
const logoHome = logos.logoHome
const logoTra = logos.logoTra

const Luminometry: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }



  const handleGoToAuditSummary = () => navigate('/resumen-auditoria');
  const handleGoToHome = () => navigate('/home');
  const handleGoToDetails = () => navigate('/resumen-detalle');
  const handleGoToETA = () => navigate('/seremi');

  const handleNext = () => {
    handleGoToETA();
  }

  return (
    <div className="lum-container">
      <h3>Resumen Luminometria</h3>
      <LUMGraph />
      <div className="table-responsive">
        <table id="luminometry-table" className="table table-bordered text-center table-sm" style={{ fontSize: '12px' }}>
          <thead className="table-light">
            <tr>
              <th>URL</th>
              <th>MEDICIÓN DE EQUIPO</th>
              <th>PORCENTAJE</th>
              <th>NOTA</th>
              <th>EVALUACIÓN</th>
              <th>GRADO DE LIMPIEZA</th>
              <th>CLASIFICACIÓN DEL RIESGO</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">0-50</td>
              <td data-label="MEDICIÓN DE EQUIPO">I ≤ 2.2</td>
              <td data-label="PORCENTAJE">100%</td>
              <td data-label="NOTA">7</td>
              <td data-label="EVALUACIÓN">EXCELENTE</td>
              <td data-label="GRADO DE LIMPIEZA">MUY LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">51-150</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.3</td>
              <td data-label="PORCENTAJE">83%</td>
              <td data-label="NOTA">6</td>
              <td data-label="EVALUACIÓN">MUY BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">51-150</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.4</td>
              <td data-label="PORCENTAJE">83%</td>
              <td data-label="NOTA">6</td>
              <td data-label="EVALUACIÓN">MUY BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">51-150</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.5</td>
              <td data-label="PORCENTAJE">83%</td>
              <td data-label="NOTA">6</td>
              <td data-label="EVALUACIÓN">MUY BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>

            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">151-250</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.6</td>
              <td data-label="PORCENTAJE">69%</td>
              <td data-label="NOTA">5</td>
              <td data-label="EVALUACIÓN">BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">MEDIANAMENTE SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">BAJO RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">151-250</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.7</td>
              <td data-label="PORCENTAJE">69%</td>
              <td data-label="NOTA">5</td>
              <td data-label="EVALUACIÓN">BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">MEDIANAMENTE SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">BAJO RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">251-500</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.8</td>
              <td data-label="PORCENTAJE">55%</td>
              <td data-label="NOTA">4</td>
              <td data-label="EVALUACIÓN">REGULAR</td>
              <td data-label="GRADO DE LIMPIEZA">ALERTA</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">RIESGO (LEVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">251-500</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.9</td>
              <td data-label="PORCENTAJE">55%</td>
              <td data-label="NOTA">4</td>
              <td data-label="EVALUACIÓN">REGULAR</td>
              <td data-label="GRADO DE LIMPIEZA">ALERTA</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">RIESGO (LEVE)</td>
            </tr>

            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td data-label="URL">501-1000</td>
              <td data-label="MEDICIÓN DE EQUIPO">3 ≤ l ≤ 4</td>
              <td data-label="PORCENTAJE">42%</td>
              <td data-label="NOTA">3</td>
              <td data-label="EVALUACIÓN">DEFICIENTE</td>
              <td data-label="GRADO DE LIMPIEZA">SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">MEDIANO RIESGO (GRAVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td data-label="URL">1001-5000</td>
              <td data-label="MEDICIÓN DE EQUIPO">4.1 ≤ l ≤ 4.9</td>
              <td data-label="PORCENTAJE">28%</td>
              <td data-label="NOTA">2</td>
              <td data-label="EVALUACIÓN">MALA</td>
              <td data-label="GRADO DE LIMPIEZA">MUY SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">ALTO RIESGO (MUY GRAVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td data-label="URL">5001-10000</td>
              <td data-label="MEDICIÓN DE EQUIPO">5 ≤ l</td>
              <td data-label="PORCENTAJE">14%</td>
              <td data-label="NOTA">1</td>
              <td data-label="EVALUACIÓN">MUY MALA</td>
              <td data-label="GRADO DE LIMPIEZA">TOTALMENTE SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">MUY ALTO RIESGO (CRÍTICO)</td>
            </tr>
          </tbody>

        </table>
      </div>

      <div className="detail-button">
        <button onClick={handleNext}>
          Siguiente <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>


      <div className="buttons-summary-logo">
        <div className="btn" onClick={handleGoToAuditSummary} title='Volver' >
          <i className="fa-solid fa-arrow-left" ></i>
        </div>
        <div className="btn">
          <img src={logoDetails} alt="details" onClick={handleGoToDetails} title='Details' />
        </div>
        <div className="btn">
          <img src={logoTra} alt="tra" onClick={handleGoToETA} title='TRA' />
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home' />
        </div>

      </div>

    </div>
  );
}

export default Luminometry;
