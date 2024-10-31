import './DesviacionesTable.css';
import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { useDesviaciones, useUpdateDesviaciones } from '../../hooks/useDesviaciones';
import { desviacionDelete } from '../../utils/apiUtils';
import { DesviacionResponse } from '../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';
import { getCurrentDate } from '../../utils/utils';
import {
  replaceNA,
  getFieldFromCellIndex,
  getColorByCriticidad,
  crearSelectEstado,
  crearSelectCriticidad,
  crearSelectAcciones,
  calcularDiasRestantes
} from './DesviacionesUtils'

const DEFAULT_ANSWER = "Sin respuesta";

const DesviacionesTable: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const location = useLocation();
  const { id, numero_requerimiento } = location.state || {};
  const { desviaciones, loading, error } = useDesviaciones();
  const { actualizarDesviaciones, isLoading, error: updateError } = useUpdateDesviaciones();

  const [localDesviaciones, setLocalDesviaciones] = useState<DesviacionResponse[]>([]);
  const [reloadData, setReloadData] = useState(false);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  useEffect(() => {
    if (desviaciones) {
      const formatDate = (dateString: string | null | undefined): string => {
        return dateString ? dateString.split('T')[0] : DEFAULT_ANSWER;
      };

      const filteredDesviaciones = desviaciones.map(desviacion => ({
        ...desviacion,
        fecha_recepcion_solicitud: formatDate(desviacion.fecha_recepcion_solicitud),
        fecha_solucion_programada: formatDate(desviacion.fecha_solucion_programada),
      })).filter(desviacion => {
        const isAuditorMatch = desviacion.auditor === context?.state?.userName;
        const isRequirementMatch = numero_requerimiento ? desviacion.numero_requerimiento === numero_requerimiento : true;
        return isAuditorMatch && isRequirementMatch;
      });

      setLocalDesviaciones(filteredDesviaciones);
    }
  }, [desviaciones, numero_requerimiento, context?.state?.userName, reloadData]);


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
      setReloadData(true);
      handleGoToHome();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
    }
  };

  const handleInputChange = (index: number, field: keyof DesviacionResponse, value: string) => {
    setLocalDesviaciones(prevDesviaciones => {
      const updatedDesviaciones = [...prevDesviaciones];
      updatedDesviaciones[index] = {
        ...updatedDesviaciones[index],
        [field]: value,
      };
      return updatedDesviaciones;
    });
  };

  const handleEditTable = async () => {
    const authToken = context.state.authToken ?? '';
    const tableBody = document.querySelector('#tabla-desviaciones tbody');
    if (!tableBody) return;
  
    tableBody.querySelectorAll('tr').forEach(async (row, rowIndex) => {
      row.querySelectorAll('td').forEach(async (cell, cellIndex) => {
        const emailColumnIndex = 14;
        const responsableColumnIndex = 4;
        
        if (cellIndex === 10) {
          const selectEstado = crearSelectEstado();
          selectEstado.value = localDesviaciones[rowIndex].estado || 'Abierto';
          selectEstado.onchange = (e) => {
            const value = (e.target as HTMLSelectElement).value;
            handleInputChange(rowIndex, 'estado', value);
          };
          cell.innerHTML = '';
          cell.appendChild(selectEstado);
        } else if (cellIndex === 6) {
          const selectCriticidad = crearSelectCriticidad();
          selectCriticidad.value = localDesviaciones[rowIndex].criticidad || 'Leve';
          selectCriticidad.onchange = (e) => {
            const value = (e.target as HTMLSelectElement).value;
            handleInputChange(rowIndex, 'criticidad', value);
          };
          cell.innerHTML = '';
          cell.appendChild(selectCriticidad);
        } else if (cellIndex === 7) {
          const preguntaAuditada = localDesviaciones[rowIndex].preguntas_auditadas || '';
          const selectAcciones = await crearSelectAcciones(authToken, preguntaAuditada);
          selectAcciones.value = localDesviaciones[rowIndex].acciones_correctivas || '';
          selectAcciones.onchange = (e) => {
            const value = (e.target as HTMLSelectElement).value;
            handleInputChange(rowIndex, 'acciones_correctivas', value);
          };
          cell.innerHTML = '';
          cell.appendChild(selectAcciones);
        } else if (cellIndex === responsableColumnIndex) {
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Responsable...';
          input.value = localDesviaciones[rowIndex].responsable_problema || '';
          input.onblur = (e) => {
            const value = (e.target as HTMLInputElement).value;
            handleInputChange(rowIndex, 'responsable_problema', value);
          };
          cell.innerHTML = '';
          cell.appendChild(input);
        } else if (cellIndex === emailColumnIndex || cell.textContent === 'N/A' || cell.textContent === DEFAULT_ANSWER) {
          const field = getFieldFromCellIndex(cellIndex);
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Text ...';
          input.value = String(localDesviaciones[rowIndex][field] || '');
          input.onblur = (e) => {
            const value = (e.target as HTMLInputElement).value;
            handleInputChange(rowIndex, field, value);
          };
          cell.innerHTML = '';
          cell.appendChild(input);
        }
      });
    });
  };
  
  
  
  const handleGoToHome = () => {
    navigate('/home');
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
            <th>N° DE REQUERIMIENTO</th>
            <th>N° DE AUDITORIA</th>
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
            <th>DÍAS RESTANTES</th>
            <th>ELIMINAR FILA</th>
          </tr>
        </thead>
        <tbody>
  {localDesviaciones.length > 0 ? (
    localDesviaciones.map((desviacion, index) => {
      const backgroundColor = getColorByCriticidad(desviacion.criticidad || DEFAULT_ANSWER);
      const diasRestantes = calcularDiasRestantes(desviacion.fecha_recepcion_solicitud || getCurrentDate(), desviacion.criticidad || 'Leve');

      let textColor = 'black';
      if (backgroundColor === 'red') {
        textColor = 'white';
      } else if (backgroundColor === 'yellow') {
        textColor = 'black';
      }

      return (
        <tr key={index} style={{ backgroundColor, color: textColor }}>
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
            <p className='desviaciones-diasRestantes' style={{ color: textColor }}>
              🚨{diasRestantes}
            </p>
          </td>
          <td>
            <button onClick={() => eliminarFila(desviacion.id)}>Eliminar</button>
          </td>
        </tr>
      );
    })
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







