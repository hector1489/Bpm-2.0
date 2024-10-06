import './DesviacionesTable.css';
import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { useDesviaciones, useUpdateDesviaciones } from '../../hooks/useDesviaciones';
import { desviacionDelete } from '../../utils/apiUtils';
import { DesviacionResponse } from '../../interfaces/interfaces';
import { getCurrentDate } from '../../utils/utils';

const DEFAULT_ANSWER = "Sin respuesta";

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const { id, numero_requerimiento } = location.state || {};
  const { desviaciones, loading, error } = useDesviaciones();
  const { actualizarDesviaciones, isLoading, error: updateError } = useUpdateDesviaciones();

  const [localDesviaciones, setLocalDesviaciones] = useState<DesviacionResponse[]>([]);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  useEffect(() => {
    if (desviaciones) {
      const filteredDesviaciones = desviaciones.filter(desviacion => {
        const isAuditorMatch = desviacion.auditor === context?.state?.userName;
        const isRequirementMatch = numero_requerimiento ? desviacion.numero_requerimiento === numero_requerimiento : true;
        return isAuditorMatch && isRequirementMatch;
      });
      setLocalDesviaciones(filteredDesviaciones);
    }
  }, [desviaciones, numero_requerimiento, context?.state?.userName]);

  const eliminarFila = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta fila?");
    if (confirmDelete && context.state.authToken) {
      try {
        await desviacionDelete(id, context.state.authToken);
        setLocalDesviaciones(prevDesviaciones => prevDesviaciones.filter(desviacion => desviacion.id !== id));
      } catch (error) {
        console.error('Error eliminando la desviación:', error);
        alert('Error al eliminar la desviación. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const replaceNA = (value: string) => (value === 'N/A' ? '' : value);

  const handleSaveChanges = async () => {
    const authToken = context.state.authToken ?? '';
  
    if (localDesviaciones.length === 0) {
      alert("No hay desviaciones para actualizar.");
      return;
    }
  
    const updatedDesviaciones = localDesviaciones.map(row => ({
      id: row.id,
      numero_requerimiento: replaceNA(row.numero_requerimiento),
      preguntas_auditadas: replaceNA(row.preguntas_auditadas),
      desviacion_o_criterio: replaceNA(row.desviacion_o_criterio),
      tipo_de_accion: replaceNA(row.tipo_de_accion),
      responsable_problema: replaceNA(row.responsable_problema),
      local: replaceNA(row.local),
      criticidad: replaceNA(row.criticidad),
      acciones_correctivas: replaceNA(row.acciones_correctivas),

      fecha_recepcion_solicitud: row.fecha_recepcion_solicitud || getCurrentDate(),
      fecha_solucion_programada: row.fecha_solucion_programada || getCurrentDate(),
      fecha_cambio_estado: row.fecha_cambio_estado || getCurrentDate(),
  
      estado: replaceNA(row.estado),
      contacto_clientes: replaceNA(row.contacto_clientes),
      evidencia_fotografica: replaceNA(row.evidencia_fotografica),
      auditor: replaceNA(row.auditor),
      correo: replaceNA(row.correo),
      detalle_foto: replaceNA(row.detalle_foto),
      fecha_ultima_modificacion: getCurrentDate(),
    }));
  
    try {
      await actualizarDesviaciones(updatedDesviaciones, authToken);
      alert("Cambios guardados exitosamente.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
    }
  };

  const handleEditTable = () => {
    const tableBody = document.querySelector('#tabla-desviaciones tbody');
    if (!tableBody) return;

    tableBody.querySelectorAll('tr').forEach((row) => {
      row.querySelectorAll('td').forEach((cell) => {
        if (cell.textContent === 'N/A' || cell.textContent === DEFAULT_ANSWER) {
          const input = document.createElement('input');
          input.type = 'text';
          input.value = '';
          input.placeholder = 'Text ...';

          cell.innerHTML = '';
          cell.appendChild(input);
        }
      });
    });
  };

  return (
    <div className="desviaciones-tabla-container">
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria: {numero_requerimiento}</p>}
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}
      {isLoading && <p>Guardando cambios...</p>}
      {updateError && <p className="error">{updateError}</p>}

      <div className="desviaciones-table-buttons">
        <button className='btn-desviaciones-table' onClick={handleEditTable}>
          <i className="fa-solid fa-pen-to-square"></i> Editar Desviaciones
        </button>
        <button className='btn-desviaciones-table' onClick={handleSaveChanges}>
          <i className="fa-solid fa-envelopes-bulk"></i> Guardar Cambios
        </button>
      </div>

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
