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

  const [statusCounts, setStatusCounts] = useState({
    leve: 0,
    moderado: 0,
    critico: 0,
  });

  const [StatusCountsEstados, setStatusCountsEstados] =  useState({
    abierto: 0,
    enProgreso: 0,
    cerrado: 0
  });


  const fetchDesviaciones = async () => {
    const authToken = state.authToken;
    setLoading(true);

    try {
      if (authToken) {
        const data: DesviacionResponse[] = await cargarDesviacionesDesdeBackend(authToken);
        if (data) {
          setDesviaciones(data);

          // Contar responsables
          const responsableCountData = data.reduce((acc: Record<string, number>, item: DesviacionResponse) => {
            const responsable = item.responsable_problema;
            if (responsable) {
              acc[responsable] = (acc[responsable] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);
          setResponsableCount(responsableCountData);

          // Contar incidentes por criticidad
          const statusCountsData = data.reduce((acc, item) => {
            const criticidadLower = item.criticidad.toLowerCase();
            if (criticidadLower === 'leve') acc.leve++;
            else if (criticidadLower === 'moderado') acc.moderado++;
            else if (criticidadLower === 'critico') acc.critico++;
            return acc;
          }, { leve: 0, moderado: 0, critico: 0 });
          setStatusCounts(statusCountsData);

          //Contar estados
          const statusEstadosData = data.reduce((acc, item) => {
            const estadosLower= item.estado.toLowerCase();
            if (estadosLower === 'abierto') acc.abierto++;
            else if (estadosLower === 'en progreso') acc.enProgreso++;
            else if (estadosLower === 'cerrado') acc.cerrado++;
            return acc;
          }, { abierto: 0, enProgreso: 0, cerrado: 0 });
          setStatusCountsEstados(statusEstadosData);

        } else {
          console.error('No se recibieron datos de desviaciones.');
          setError('No se pudieron cargar las desviaciones.');
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
              <p><i className="fas fa-exclamation text-warning"></i> <span id="estadoAbierto">{StatusCountsEstados.abierto}</span> Abiertos</p>
              <p><i className="fas fa-check text-success"></i> <span id="fueraDePlazo-Head">{StatusCountsEstados.enProgreso}</span> En Progreso</p>
              <p><i className="fas fa-times-circle text-danger"></i>  <span id="estadoCerrado">{StatusCountsEstados.cerrado}</span> Cerrados</p>
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
              <h5><span id="criticidadLeve">{statusCounts.leve}</span></h5>
              <p>Leve</p>
            </div>
          </div>

          <div className="card bg-warning text-white bordered-box">
            <div className="card-body">
              <h5><span id="criticidadModerado">{statusCounts.moderado}</span></h5>
              <p>Moderado</p>
            </div>
          </div>

          <div className="card bg-danger text-white bordered-box">
            <div className="card-body">
              <h5><span id="criticidadCritico">{statusCounts.critico}</span></h5>
              <p>Crítico</p>
            </div>
          </div>

          <div className="card bg-warning text-white bordered-box">
            <div className="card-body">
              <h5><span id="estadoAbierto">{StatusCountsEstados.abierto}</span></h5>
              <p>Abierta</p>
            </div>
          </div>

          <div className="card bg-info text-white bordered-box">
            <div className="card-body">
              <h5><span id="estadoAbierto">{StatusCountsEstados.enProgreso}</span></h5>
              <p>En Progreso</p>
            </div>
          </div>

          <div className="card bg-success text-white bordered-box">
            <div className="card-body">
            <span id="estadoAbierto">{StatusCountsEstados.cerrado}</span>
              <p>Cerrada</p>
            </div>
          </div>

          <div className="card bg-red text-white bordered-box">
            <div className="card-body">
              <h5><span id="fueraDePlazo">0</span></h5>
              <p>Fuera de plazo</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default IncidentSummary;
