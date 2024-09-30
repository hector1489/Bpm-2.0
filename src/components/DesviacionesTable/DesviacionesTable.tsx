import './DesviacionesTable.css';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cargarDesviacionesDesdeBackend } from '../../utils/apiUtils';

const DEFAULT_ANSWER = "Sin respuesta";

interface Desviacion {
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

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

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
          console.log(data);
          const mappedData = data.map((item: DesviacionResponse) => ({
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
          setDesviaciones(mappedData);
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

  const eliminarFila = (index: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta fila?");
    if (confirmDelete) {
      setDesviaciones((prevDesviaciones) => prevDesviaciones.filter((_, i) => i !== index));
    }
  };

  const agregarDesviacion = () => {
    console.log('Agregar desviación');
  };

  return (
    <div className="desviaciones-tabla-container">
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}

      <table id="tabla-desviaciones">
        <thead>
          <tr>
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
                  <button onClick={() => eliminarFila(index)}>Eliminar</button>
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

      <div className="btn-group">
        <button onClick={agregarDesviacion}>Agregar desviaciones</button>
      </div>
    </div>
  );
};

export default DesviacionesTable;
