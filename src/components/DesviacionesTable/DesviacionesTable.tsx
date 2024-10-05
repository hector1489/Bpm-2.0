import './DesviacionesTable.css';
import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { useDesviaciones } from '../../hooks/useDesviaciones';
import { desviacionDelete, enviarDatosAuditoria } from '../../utils/apiUtils';

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

  const handleSaveChanges = async () => {
    const authToken = state.authToken ?? '';
    const tableBody = document.querySelector('#tabla-desviaciones tbody');
    if (!tableBody) return;

    const updatedDesviaciones: any[] = [];

    tableBody.querySelectorAll('tr').forEach((row) => {
      const desviacion: any = {};
      const cells = row.querySelectorAll('td');

      desviacion.id = cells[0].textContent?.trim() || null;
      desviacion.numeroRequerimiento = (cells[1].querySelector('input')?.value || cells[1].textContent)?.trim() || '';
      desviacion.pregunta = (cells[2].querySelector('input')?.value || cells[2].textContent)?.trim() || '';
      desviacion.respuesta = (cells[3].querySelector('input')?.value || cells[3].textContent)?.trim() || '';
      desviacion.responsableDelProblema = (cells[4].querySelector('input')?.value || cells[4].textContent)?.trim() || '';
      desviacion.local = (cells[5].querySelector('input')?.value || cells[5].textContent)?.trim() || '';
      desviacion.criticidad = (cells[6].querySelector('input')?.value || cells[6].textContent)?.trim() || '';
      desviacion.accionesCorrectivas = (cells[7].querySelector('input')?.value || cells[7].textContent)?.trim() || '';
      desviacion.fechaRecepcionSolicitud = (cells[8].querySelector('input')?.value || cells[8].textContent)?.trim() || '';
      desviacion.fechaSolucionProgramada = (cells[9].querySelector('input')?.value || cells[9].textContent)?.trim() || '';
      desviacion.estado = (cells[10].querySelector('input')?.value || cells[10].textContent)?.trim() || '';
      desviacion.fechaCambioEstado = (cells[11].querySelector('input')?.value || cells[11].textContent)?.trim() || '';
      desviacion.contactoClientes = (cells[12].querySelector('input')?.value || cells[12].textContent)?.trim() || '';
      desviacion.evidenciaFotografica = (cells[13].querySelector('input')?.value || cells[13].textContent)?.trim() || '';
      desviacion.auditor = (cells[14].querySelector('input')?.value || cells[14].textContent)?.trim() || '';
      desviacion.correo = (cells[15].querySelector('input')?.value || cells[15].textContent)?.trim() || '';

      updatedDesviaciones.push(desviacion);
    });

    try {
      await enviarDatosAuditoria(updatedDesviaciones, authToken);
      alert('Datos enviados exitosamente');
    } catch (error) {
      console.error('Error al enviar datos al backend:', error);
      alert('Error al enviar datos. Intenta nuevamente.');
    }
  };



  return (
    <div className="desviaciones-tabla-container">
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}

      <div className="desviaciones-table-buttons">
        <button className='btn-desviaciones-table' onClick={handleEditTable}>
        <i className="fa-solid fa-pen-to-square"></i>
          Editar Desviaciones
        </button>
        <button className='btn-desviaciones-table' onClick={handleSaveChanges}>
          <i className="fa-solid fa-envelopes-bulk"></i>
          Guardar Cambios
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
