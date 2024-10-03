import './DesviacionesTable.css'
import { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../../context/GlobalState'
import { cargarDesviacionesDesdeBackend, desviacionDelete } from '../../utils/apiUtils'

const DEFAULT_ANSWER = "Sin respuesta";

interface Desviacion {
  id: number;
  numeroRequerimiento: string;
  preguntasAuditadas: string;
  desviacionOCriterio: string;
  responsableProblema: string;
  local: string;
  criticidad: string;
  accionesCorrectivas: string;
  fechaRecepcion: string;
  fechaSolucion: string;
  estado: string;
  fechaCambio: string;
  contactoClientes: string;
  evidenciaFotografica: string;
  auditor: string;
  correo: string;
}

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

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { id, numero_requerimiento } = location.state || {};
  const { state } = context;
  const [desviaciones, setDesviaciones] = useState<Desviacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesviaciones = async () => {
    const authToken = state.authToken;
    setLoading(true);

    try {
      if (authToken) {
        const data: DesviacionResponse[] = await cargarDesviacionesDesdeBackend(authToken);
        if (data) {
          const mappedData = data.map((item: DesviacionResponse) => ({
            id: item.id,
            numeroRequerimiento: item.numero_requerimiento,
            preguntasAuditadas: item.preguntas_auditadas,
            desviacionOCriterio: item.desviacion_o_criterio,
            responsableProblema: item.responsable_problema,
            local: item.local,
            criticidad: item.criticidad,
            accionesCorrectivas: item.acciones_correctivas,
            fechaRecepcion: item.fecha_recepcion_solicitud,
            fechaSolucion: item.fecha_solucion_programada,
            estado: item.estado,
            fechaCambio: item.fecha_cambio_estado,
            contactoClientes: item.contacto_clientes,
            evidenciaFotografica: item.evidencia_fotografica,
            auditor: item.auditor,
            correo: item.correo,
          }));

          const filteredData = mappedData.filter(desviacion => {
            const isAuditorMatch = desviacion.auditor === state.userName;
            const isRequirementMatch = numero_requerimiento ? desviacion.numeroRequerimiento === numero_requerimiento : true;

            return isAuditorMatch && isRequirementMatch;
          });

          setDesviaciones(filteredData);
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


  const eliminarFila = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta fila?");
    if (confirmDelete) {
      const authToken = state.authToken;
      if (authToken) {
        try {
          await desviacionDelete(id, authToken);
          setDesviaciones(prevDesviaciones => prevDesviaciones.filter(desviacion => desviacion.id !== id));
        } catch (error) {
          console.error('Error eliminando la desviación:', error);
        }
      }
    }
  };

 

  return (
    <div className="desviaciones-tabla-container">
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}

      <table id="tabla-desviaciones">
        <thead>
          <tr>
            <th>ID</th>
            <th>N° DE REQUERIMIENTO</th>
            <th>PREGUNTAS AUDITADAS</th>
            <th>CRITERIO</th>
            <th>RESPONSABLE</th>
            <th>NOMBRE DEL ESTABLECIMIENTO</th>
            <th>CRITICIDAD</th>
            <th>ACCIONES CORRECTIVAS</th>
            <th>FECHA DE INGRESO</th>
            <th>SOLUCION PROGRAMADA</th>
            <th>ESTADO</th>
            <th>FECHA DE RECEPCION</th>
            <th>CONTACTO CLIENTE</th>
            <th>EVIDENCIA FOTOGRAFICA</th>
            <th>AUDITOR</th>
            <th>EMAIL</th>
            <th>ELIMINAR FILA</th>
          </tr>
        </thead>
        <tbody>
          {desviaciones.length > 0 ? (
            desviaciones.map((desviacion, index) => (
              <tr key={index}>
                <td>{desviacion.id || DEFAULT_ANSWER}</td>
                <td>{desviacion.numeroRequerimiento || DEFAULT_ANSWER}</td>
                <td>{desviacion.preguntasAuditadas || DEFAULT_ANSWER}</td>
                <td>{desviacion.desviacionOCriterio || DEFAULT_ANSWER}</td>
                <td>{desviacion.responsableProblema || DEFAULT_ANSWER}</td>
                <td>{desviacion.local || DEFAULT_ANSWER}</td>
                <td>{desviacion.criticidad || DEFAULT_ANSWER}</td>
                <td>{desviacion.accionesCorrectivas || DEFAULT_ANSWER}</td>
                <td>{desviacion.fechaRecepcion || DEFAULT_ANSWER}</td>
                <td>{desviacion.fechaSolucion || DEFAULT_ANSWER}</td>
                <td>{desviacion.estado || DEFAULT_ANSWER}</td>
                <td>{desviacion.fechaCambio || DEFAULT_ANSWER}</td>
                <td>{desviacion.contactoClientes || DEFAULT_ANSWER}</td>
                <td>{desviacion.evidenciaFotografica || DEFAULT_ANSWER}</td>
                <td>{desviacion.auditor || DEFAULT_ANSWER}</td>
                <td>{desviacion.correo || DEFAULT_ANSWER}</td>
                <td>
                  <button onClick={() => eliminarFila(desviacion.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={16}>No hay desviaciones disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default DesviacionesTable;
