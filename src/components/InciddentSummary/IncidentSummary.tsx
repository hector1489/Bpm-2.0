import { cargarDesviacionesDesdeBackend } from '../../utils/apiUtils';
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/GlobalState'
import './IncidentSummary.css';

interface DesviacionResponse {
  id: number;
  numero_requerimiento: string;
  preguntas_auditadas: string;
  desviacion_o_criterio: string;
  responsable_problema: string;
  local: string;
  criticidad: string;
  acciones_correctivas: string;
  fecha_recepcion_solicitud: string;
  fecha_solucion_programada: string;
  estado: string;
  fecha_cambio_estado: string;
  contacto_clientes: string;
  evidencia_fotografica: string;
  auditor: string;
  correo: string;
}



const IncidentSummary: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }


  const { state } = context;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [desviaciones, setDesviaciones] = useState<DesviacionResponse[] | null>(null);
  const [responsableCount, setResponsableCount] = useState<Record<string, number>>({});

  const fetchDesviaciones = async () => {
    const authToken = state.authToken;
    setLoading(true);

    try {
      if (authToken) {
        const data: DesviacionResponse[] = await cargarDesviacionesDesdeBackend(authToken);
        if (data) {
          const mappedData = data.map((item: DesviacionResponse) => ({
            id: item.id,
            numero_requerimiento: item.numero_requerimiento,
            preguntas_auditadas: item.preguntas_auditadas,
            desviacion_o_criterio: item.desviacion_o_criterio,
            responsable_problema: item.responsable_problema,
            local: item.local,
            criticidad: item.criticidad,
            acciones_correctivas: item.acciones_correctivas,
            fecha_recepcion_solicitud: item.fecha_recepcion_solicitud,
            fecha_solucion_programada: item.fecha_solucion_programada,
            estado: item.estado,
            fecha_cambio_estado: item.fecha_cambio_estado,
            contacto_clientes: item.contacto_clientes,
            evidencia_fotografica: item.evidencia_fotografica,
            auditor: item.auditor,
            correo: item.correo,
          }));
          setDesviaciones(mappedData);

           // Agrupar y contar desviaciones por responsable
           const responsableCountData: Record<string, number> = data.reduce((acc: Record<string, number>, item: DesviacionResponse) => {
            const responsable = item.responsable_problema;
            if (responsable) {
              acc[responsable] = (acc[responsable] || 0) + 1;
            }
            return acc;
          }, {});

          setResponsableCount(responsableCountData);

          console.log('Responsables y sus desviaciones:', responsableCountData);

        }
      } else {
        console.error('No se pudo obtener el token de autenticación.');
        setError('Token de autenticación no disponible.');
      }
    } catch (error) {
      console.error('Error al cargar las desviaciones:', error);
      setError('No se pudieron cargar las desviaciones.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDesviaciones();
  }, []);

  const totalIncidencias = desviaciones ? desviaciones.length : 0;



  return (
    <div className="incident-summary-container">
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid-container">
        <div className="summary-cards">

          <div className="summary-card animate__fadeInUp bordered-box total-incidencias">

            <div className="card-header bg-primary text-white text-center">
              <i className="fas fa-exclamation-circle text-warning"></i> Total Incidencias
            </div>

            <div className="card-body">
              <h5 className="card-title text-center"><span id="totalIncidencias">{totalIncidencias}</span></h5>
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
                {Object.entries(responsableCount).map(([responsable, count], index) => (
                  <tr key={index}>
                    <td><i className="fas fa-user text-primary"></i> {responsable}</td>
                    <td>{count}</td>
                  </tr>
                ))}
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
