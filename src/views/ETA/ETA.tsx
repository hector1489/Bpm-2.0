import { ETAGraph } from '../../components'
import { useNavigate } from 'react-router-dom'
import './ETA.css'

const ETA: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToAuditSummary= () => {
    navigate('/resumen-auditoria')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <>
      <ETAGraph />
      <div className="legend">
        <span className="legend-item" style={{ color: 'green' }}>●</span> 90% - 100%: Cumplimiento alto <br />
        <span className="legend-item" style={{ color: 'yellow' }}>●</span> 75% - 89%: Cumplimiento medio <br />
        <span className="legend-item" style={{ color: 'red' }}>●</span> 0% - 74%: Cumplimiento bajo
      </div>
      <div className="table-responsive">
        <table id="tabla-warning" className="table table-bordered">
          <thead>
            <tr>
              <th className="th-warning">Items Evaluados</th>
              <th colSpan={5} className="th-warning">Preguntas Evaluadas</th>
              <th colSpan={5} className="th-warning">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Control de Superficies */}
            <tr>
              <th rowSpan={2} className="tr-label">CONTROL DE SUPERFICIES CONTACTO CON ALIMENTOS E INSTALACIONES</th>
              <td colSpan={5}>
                CS - Los registros generados son coherentes con lo especificado en el programa. (Art. 69)
              </td>
              <td colSpan={5}><span id="warning-cs-registro"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                CS - Se adoptan las medidas necesarias para evitar la contaminación de los equipos después
                de limpiarse y desinfectarse. (Art.42)
              </td>
              <td colSpan={5}><span id="warning-cs-medidas"></span></td>
            </tr>

            {/* Control de Salud e Higiene */}
            <tr>
              <th rowSpan={1} className="tr-label">CONTROL DE SALUD E HIGIENE DE EMPLEADOS</th>
              <td colSpan={5}>
                Existe un programa de higiene del personal y sus registros correspondientes. (Art. 55, 56,
                60, 69).
              </td>
              <td colSpan={5}><span id="warning-higiene-programa"></span></td>
            </tr>

            {/* Control de Plagas */}
            <tr>
              <th rowSpan={2} className="tr-label">CONTROL DE PLAGAS</th>
              <td colSpan={5}>
                CP - La empresa a cargo del programa de aplicación de agentes químicos o biológicos para
                el control de plagas cuenta con Autorización sanitaria. (Art. 48).
              </td>
              <td colSpan={5}><span id="warning-plagas-autorizacion"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                CP - Los desechos se disponen de forma de impedir el acceso y proliferación de plagas.
                (Art. 40).
              </td>
              <td colSpan={5}><span id="warning-plagas-desechos"></span></td>
            </tr>

            {/* Recepcion */}
            <tr>
              <th rowSpan={2} className="tr-label">RECEPCION</th>
              <td colSpan={5}>
                REC - Las materias primas utilizadas provienen de establecimientos autorizados y
                debidamente rotuladas y/o identificadas. (Art. 61, 96).
              </td>
              <td colSpan={5}><span id="warning-recepcion-materias"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                REC - Se cuenta con las especificaciones escritas para cada materia prima. (condiciones de
                almacenamiento, duración, uso, etc.).
              </td>
              <td colSpan={5}><span id="warning-recepcion-especificaciones"></span></td>
            </tr>

            {/* Procesos y Productos Terminados */}
            <tr>
              <th rowSpan={6} className="tr-label">PROCESOS Y PRODUCTOS TERMINADOS</th>
              <td colSpan={5}>
                PPT - El flujo del personal, vehículos y de materias primas en las distintas etapas del
                proceso, es ordenado y conocido por todos los que participan en la elaboración, para evitar
                contaminación cruzada. (Art. 63).
              </td>
              <td colSpan={5}><span id="warning-ppt-flujo"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                PPT - Se cuenta con procedimientos escritos de los procesos (Formulación del producto,
                flujos de operación, procesos productivos). (Art. 3, 11, 63, 66, 69, 132).
              </td>
              <td colSpan={5}><span id="warning-ppt-procedimientos"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                PPT - Los productos se almacenan en condiciones que eviten su deterioro y contaminación
                (envases, temperatura, humedad, etc.). (Art.11, 67).
              </td>
              <td colSpan={5}><span id="warning-ppt-almacenamiento"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                PPT - La distribución de los productos terminados se realiza en vehículos autorizados,
                limpios y en buen estado. (Art. 11, 68).
              </td>
              <td colSpan={5}><span id="warning-ppt-distribucion"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                PPT - Para envasar los productos se utilizan materiales adecuados, los cuales son
                mantenidos en condiciones que eviten su contaminación. (Art. 11, 123).
              </td>
              <td colSpan={5}><span id="warning-ppt-envases"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                PPT - Los productos se etiquetan de acuerdo a las exigencias reglamentarias. (Art. 107 al
                121).
              </td>
              <td colSpan={5}><span id="warning-ppt-observaciones"></span></td>
            </tr>

            {/* Capacitacion */}
            <tr>
              <th rowSpan={2} className="tr-label">CAP - CAPACITACION</th>
              <td colSpan={5}>
                DOC - Existe un programa escrito y con sus registros correspondientes de capacitación del
                personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69).
              </td>
              <td colSpan={5}><span id="warning-existe-programa"></span></td>
            </tr>
            <tr>
              <td colSpan={5}>
                Existe un programa escrito de capacitación del personal de aseo en técnicas de limpieza y
                sus registros correspondientes. (Art. 41, 69).
              </td>
              <td colSpan={5}><span id="warning-existe-capacitacion"></span></td>
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

export default ETA
