import './DesviacionesTable.css';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { Desviacion } from '../../interfaces/interfaces';

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);
  const [newDesviacion, setNewDesviacion] = useState<Desviacion>({
    numeroRequerimiento: '',
    pregunta: '',
    respuesta: '',
  });

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  useEffect(() => {
  }, [state.desviaciones]);

  const addRow = () => {
    if (!newDesviacion.numeroRequerimiento || !newDesviacion.pregunta || !newDesviacion.respuesta) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    
    context.addDesviacion(newDesviacion);
    setNewDesviacion({ numeroRequerimiento: '', pregunta: '', respuesta: '' });
  };

  const deleteRow = (index: number) => {
    const newRows = (state.desviaciones || []).filter((_, i) => i !== index);
    context.setState(prevState => ({
      ...prevState,
      desviaciones: newRows
    }));
  };

  return (
    <div className="desviaciones-tabla-container">
      <h3>Tabla de Desviaciones</h3>
      
      {/* Formulario para añadir nuevas desviaciones */}
      <div>
        <input 
          type="text" 
          placeholder="Número de Requerimiento" 
          value={newDesviacion.numeroRequerimiento}
          onChange={(e) => setNewDesviacion({ ...newDesviacion, numeroRequerimiento: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Pregunta" 
          value={newDesviacion.pregunta}
          onChange={(e) => setNewDesviacion({ ...newDesviacion, pregunta: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Respuesta" 
          value={newDesviacion.respuesta}
          onChange={(e) => setNewDesviacion({ ...newDesviacion, respuesta: e.target.value })}
        />
        {/* Añadir más campos según sea necesario */}
        <button onClick={addRow}>Agregar Desviación</button>
      </div>

      <table id="tabla-desviaciones">
        <thead>
          <tr>
            {/* Encabezados de la tabla */}
            <th>NÚMERO DE REQUERIMIENTO</th>
            <th>PREGUNTAS AUDITADAS</th>
            <th>DESVIACIÓN O CRITERIO</th>
            <th>TIPO DE ACCIÓN</th>
            <th>RESPONSABLE DEL PROBLEMA</th>
            <th>LOCAL</th>
            <th>CRITICIDAD</th>
            <th>ACCIONES CORRECTIVAS</th>
            <th>FECHA DE RECEPCIÓN DE SOLICITUD</th>
            <th>FECHA DE SOLUCIÓN PROGRAMADA</th>
            <th>ESTADO</th>
            <th>FECHA DE CAMBIO DE ESTADO</th>
            <th>CONTACTO CLIENTES</th>
            <th>EVIDENCIA FOTOGRÁFICA</th>
            <th>DETALLE DE FOTO</th>
            <th>AUDITOR</th>
            <th>CORREO</th>
            <th>FECHA ÚLTIMA MODIFICACIÓN</th>
            <th>ELIMINAR DESVIACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {(state.desviaciones || []).map((row, index) => (
            <tr key={index}>
              <td>{row.numeroRequerimiento}</td>
              <td>{row.pregunta}</td>
              <td>{row.respuesta}</td>
              <td>{row.tipoDeAccion}</td>
              <td>{row.responsableDelProblema}</td>
              <td>{row.local}</td>
              <td>{row.criticidad}</td>
              <td>{row.accionesCorrectivas}</td>
              <td>{row.fechaRecepcionSolicitud}</td>
              <td>{row.fechaSolucionProgramada}</td>
              <td>{row.estado}</td>
              <td>{row.fechaCambioEstado}</td>
              <td>{row.contactoClientes}</td>
              <td>{row.evidenciaFotografica}</td>
              <td>{row.detalleFoto}</td>
              <td>{row.auditor}</td>
              <td>{row.correo}</td>
              <td>{row.fechaUltimaModificacion}</td>
              <td><button onClick={() => deleteRow(index)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesviacionesTable;
