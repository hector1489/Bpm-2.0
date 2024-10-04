import './DesviacionesTable.css';
import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { useDesviaciones } from '../../hooks/useDesviaciones';
import { desviacionDelete } from '../../utils/apiUtils';

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

const DEFAULT_ANSWER = "Sin respuesta";

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const { id, numero_requerimiento } = location.state || {};
  const { desviaciones, loading, error } = useDesviaciones();
 
  const [localDesviaciones, setLocalDesviaciones] = useState<DesviacionResponse[]>(desviaciones || []); 

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  useEffect(() => {
    if (desviaciones) {
      const filteredDesviaciones = desviaciones.filter(desviacion => {
        const isAuditorMatch = desviacion.auditor === context.state.userName;
        const isRequirementMatch = numero_requerimiento ? desviacion.numero_requerimiento === numero_requerimiento : true;
        return isAuditorMatch && isRequirementMatch;
      });

      setLocalDesviaciones(filteredDesviaciones);
    }
  }, [desviaciones, numero_requerimiento, context.state.userName]);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;
  const authToken = state.authToken;

  const eliminarFila = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta fila?");
    if (confirmDelete && authToken) {
      try {
        await desviacionDelete(id, authToken);
        setLocalDesviaciones(prevDesviaciones => prevDesviaciones.filter(desviacion => desviacion.id !== id));
      } catch (error) {
        console.error('Error eliminando la desviación:', error);
        alert('Error al eliminar la desviación. Por favor, inténtalo de nuevo.'); 
      }
    }
  };

  const handleEditTable = () => {
    console.log('editar tabla');
  };

  return (
    <div className="desviaciones-tabla-container">
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}

      <button onClick={handleEditTable}>Editar Desviaciones</button>

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
          {localDesviaciones.length > 0 ? (
            localDesviaciones.map((desviacion, index) => (
              <tr key={index}>
                <td>{desviacion.id || DEFAULT_ANSWER}</td>
                <td>{desviacion.numero_requerimiento || DEFAULT_ANSWER}</td>
                <td>{desviacion.preguntas_auditadas || DEFAULT_ANSWER}</td>
                <td>{desviacion.desviacion_o_criterio || DEFAULT_ANSWER}</td>
                <td>{desviacion.responsable_problema || DEFAULT_ANSWER}</td>
                <td>{desviacion.local || DEFAULT_ANSWER}</td>
                <td>{desviacion.criticidad || DEFAULT_ANSWER}</td>
                <td>{desviacion.acciones_correctivas || DEFAULT_ANSWER}</td>
                <td>{desviacion.fecha_recepcion_solicitud || DEFAULT_ANSWER}</td>
                <td>{desviacion.fecha_solucion_programada || DEFAULT_ANSWER}</td>
                <td>{desviacion.estado || DEFAULT_ANSWER}</td>
                <td>{desviacion.fecha_cambio_estado || DEFAULT_ANSWER}</td>
                <td>{desviacion.contacto_clientes || DEFAULT_ANSWER}</td>
                <td>{desviacion.evidencia_fotografica || DEFAULT_ANSWER}</td>
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
