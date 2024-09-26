import './DesviacionesTable.css'
import { useContext, useState, useEffect, useCallback } from 'react'
import { AppContext } from '../../context/GlobalState'
import { obtenerTodasLasAccionesDesdeAPI } from '../../utils/apiUtils'
import { extractPercentage, getCurrentDate, estados, calculateSolutionDate } from '../../utils/utils';

interface ISelectedRow {
  numeroRequerimiento: number;
  pregunta: string;
  respuesta: string;
  fecha: string;
  auditor: string;
  email: string;
  nombreEstablecimiento: string;
  responsableDelProblema: string;
  contactoCliente?: string;
  solucionProgramada?: string;
  accionesCorrectivas?: string;
  estado?: string;
  photoUrl: string;
}

const DEFAULT_ANSWER = "Sin respuesta";

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state, addDesviacion } = context;

  const [selectedRows, setSelectedRows] = useState<ISelectedRow[]>([]);
  const [accionesCorrectivas, setAccionesCorrectivas] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccionesCorrectivas = async () => {
      const acciones = await obtenerTodasLasAccionesDesdeAPI();
      setAccionesCorrectivas(acciones);
    };
    fetchAccionesCorrectivas();
  }, []);

  const addAllRows = useCallback(() => {
    const email = state.auditSheetData.auditorEmail;
    const auditor = state.userName || '';
    const nombreEstablecimiento = state.auditSheetData.nombreEstablecimiento;
    const responsableDelProblema = state.auditSheetData.supervisorEstablecimiento;
    const photos = state.photos;

    const rowsToAdd = state.IsHero
      .filter((hero) => extractPercentage(hero.answer ?? DEFAULT_ANSWER) < 100)
      .map((hero) => {
        const criticidadColor = getColorByPercentage(extractPercentage(hero.answer ?? DEFAULT_ANSWER));
        const solucionProgramada = calculateSolutionDate(criticidadColor);
        const photo = photos.find(photo => photo.question === hero.question);

        return {
          numeroRequerimiento: hero.id,
          pregunta: hero.question,
          respuesta: hero.answer ?? DEFAULT_ANSWER,
          fecha: getCurrentDate(),
          auditor: auditor,
          email: email,
          nombreEstablecimiento: nombreEstablecimiento,
          responsableDelProblema: responsableDelProblema,
          solucionProgramada,
          accionesCorrectivas: '',
          estado: 'Abierto',
          photoUrl: photo ? photo.photoUrl : null || 'N/A'
        };
      });

    setSelectedRows(rowsToAdd);
  }, [state])

  const saveDesviaciones = useCallback(() => {
    selectedRows.forEach(row => {
      addDesviacion({
        ...row,
        numeroRequerimiento: row.numeroRequerimiento.toString(),
      });
    });
    setSelectedRows([]);
  }, [selectedRows, addDesviacion])

  const removeRow = useCallback(
    (index: number) => {
      setSelectedRows((prevRows) => prevRows.filter((_, i) => i !== index));
    },
    []
  )

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'yellow';
    return 'red';
  }

  const renderCriticidadCircle = (answer: string) => {
    const percentage = extractPercentage(answer);
    const color = getColorByPercentage(percentage);
    return (
      <span
        className="criticidad-circle"
        style={{ backgroundColor: color }}
      />
    );
  }

  const handleClientContactChange = (index: number, value: string) => {
    setSelectedRows(prevRows => prevRows.map((row, i) =>
      i === index ? { ...row, contactoCliente: value } : row
    ));
  }

  const handleAccionesChange = (index: number, value: string) => {
    setSelectedRows(prevRows => prevRows.map((row, i) =>
      i === index ? { ...row, accionesCorrectivas: value } : row
    ));
  }

  const handleEstadoChange = (index: number, value: string) => {
    setSelectedRows(prevRows => prevRows.map((row, i) =>
      i === index ? { ...row, estado: value } : row
    ));
  }

  const obtenerAccionesPorPregunta = (preguntaSeleccionada: string): string[] => {
    const normalizedPregunta = preguntaSeleccionada.trim().toLowerCase();
    const question = accionesCorrectivas.find(q => q.question && q.question.trim().toLowerCase() === normalizedPregunta);
    return question ? question.action : [];
  }

  return (
    <div className="desviaciones-tabla-container">
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
          {selectedRows.map((row, index) => (
            <tr key={row.numeroRequerimiento}>
              <td>{row.numeroRequerimiento}</td>
              <td>{row.pregunta}</td>
              <td>{row.respuesta}</td>
              <td>{row.responsableDelProblema}</td>
              <td>{row.nombreEstablecimiento}</td>
              <td>{renderCriticidadCircle(row.respuesta)}</td>
              <td>
                <select
                  value={row.accionesCorrectivas || ''}
                  onChange={(e) => handleAccionesChange(index, e.target.value)}
                >
                  <option value="">Seleccionar acción</option>
                  {obtenerAccionesPorPregunta(row.pregunta).map((accion, i) => (
                    <option key={i} value={accion}>{accion}</option>
                  ))}
                </select>
              </td>
              <td>{row.fecha}</td>
              <td>{row.solucionProgramada}</td>
              <td>
                <select
                  value={row.estado || 'Abierto'}
                  onChange={(e) => handleEstadoChange(index, e.target.value)}
                >
                  {estados.map((estado, i) => (
                    <option key={i} value={estado}>{estado}</option>
                  ))}
                </select>
              </td>
              <td>{row.fecha}</td>
              <td>
                <input
                  type="text"
                  value={row.contactoCliente || ''}
                  onChange={(e) => handleClientContactChange(index, e.target.value)}
                />
              </td>
              <td>
                {row.photoUrl ? (
                  <img
                    src={row.photoUrl}
                    alt={`Evidencia de ${row.pregunta}`}
                    style={{ width: '50px', height: 'auto' }}
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td>{row.auditor}</td>
              <td>{row.email}</td>
              <td>
                <button onClick={() => removeRow(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="btn-group">
        <button onClick={addAllRows}>Agregar desviaciones</button>
        <button onClick={saveDesviaciones}>Guardar</button>
      </div>
    </div>
  );
}

export default DesviacionesTable;
