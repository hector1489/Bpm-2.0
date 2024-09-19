import { LUMGraph } from '../../components/index'
import { useNavigate } from 'react-router-dom'
import './Luminometry.css'

const Luminometry: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToAuditSummary= () => {
    navigate('/resumen-auditoria')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <>
      <LUMGraph />
      <div className="table-responsive">
        <table className="table table-bordered text-center table-sm">
          <thead className="table-light">
            <tr>
              <th scope="col">URL</th>
              <th scope="col">MEDICIÓN DE EQUIPO</th>
              <th scope="col">PORCENTAJE</th>
              <th scope="col">NOTA</th>
              <th scope="col">EVALUACIÓN</th>
              <th scope="col">GRADO DE LIMPIEZA</th>
              <th scope="col">CLASIFICACIÓN DEL RIESGO</th>
            </tr>
          </thead>
          <tbody>
            {/* Filas Verdes */}
            <tr className="bg-light-green">
              <td>0-50</td>
              <td>I ≤ 2.2</td>
              <td>100%</td>
              <td>7</td>
              <td>EXCELENTE</td>
              <td>MUY LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>
            <tr className="bg-light-green">
              <td>51-150</td>
              <td>2.3</td>
              <td>83%</td>
              <td>6</td>
              <td>MUY BUENO</td>
              <td>LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>
            <tr className="bg-light-green">
              <td>51-150</td>
              <td>2.4</td>
              <td>83%</td>
              <td>6</td>
              <td>MUY BUENO</td>
              <td>LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>
            <tr className="bg-light-green">
              <td>51-150</td>
              <td>2.5</td>
              <td>83%</td>
              <td>6</td>
              <td>MUY BUENO</td>
              <td>LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>

            {/* Filas Amarillas */}
            <tr className="bg-yellow">
              <td>151-250</td>
              <td>2.6</td>
              <td>69%</td>
              <td>5</td>
              <td>BUENO</td>
              <td>MEDIANAMENTE SUCIO</td>
              <td>BAJO RIESGO</td>
            </tr>
            <tr className="bg-yellow">
              <td>151-250</td>
              <td>2.7</td>
              <td>69%</td>
              <td>5</td>
              <td>BUENO</td>
              <td>MEDIANAMENTE SUCIO</td>
              <td>BAJO RIESGO</td>
            </tr>
            <tr className="bg-yellow">
              <td>251-500</td>
              <td>2.8</td>
              <td>55%</td>
              <td>4</td>
              <td>REGULAR</td>
              <td>ALERTA</td>
              <td>RIESGO (LEVE)</td>
            </tr>
            <tr className="bg-yellow">
              <td>251-500</td>
              <td>2.9</td>
              <td>55%</td>
              <td>4</td>
              <td>REGULAR</td>
              <td>ALERTA</td>
              <td>RIESGO (LEVE)</td>
            </tr>

            {/* Filas Rojas */}
            <tr className="bg-red">
              <td>501-1000</td>
              <td>3 ≤ l ≤ 4</td>
              <td>42%</td>
              <td>3</td>
              <td>DEFICIENTE</td>
              <td>SUCIO</td>
              <td>MEDIANO RIESGO (GRAVE)</td>
            </tr>
            <tr className="bg-red">
              <td>1001-5000</td>
              <td>4.1 ≤ l ≤ 4.9</td>
              <td>28%</td>
              <td>2</td>
              <td>MALA</td>
              <td>MUY SUCIO</td>
              <td>ALTO RIESGO (MUY GRAVE)</td>
            </tr>
            <tr className="bg-red">
              <td>5001-10000</td>
              <td>5 ≤ l</td>
              <td>14%</td>
              <td>1</td>
              <td>MUY MALA</td>
              <td>TOTALMENTE SUCIO</td>
              <td>MUY ALTO RIESGO (CRÍTICO)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="buttons-luminometry">
        <button onClick={handleGoToAuditSummary}>volver</button>
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </>
  )
}

export default Luminometry
