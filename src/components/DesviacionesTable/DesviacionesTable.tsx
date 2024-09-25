import './DesviacionesTable.css'
import { useContext, useState, useEffect, useCallback } from 'react'
import { AppContext } from '../../context/GlobalState'

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
}

const DEFAULT_ANSWER = "Sin respuesta";

// Función para obtener datos desde la API
async function obtenerTodasLasAccionesDesdeAPI() {
  try {
    const response = await fetch('https://bpm-backend.onrender.com/accion-correctivas');
    if (!response.ok) {
      throw new Error('Error al obtener datos de la API');
    }
    const data = await response.json();
    return data; // Retornamos los datos obtenidos
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

const extractPercentage = (answer: string): number => {
  const match = answer.match(/^(\d+)%/);
  return match ? parseInt(match[1], 10) : 100;
}

const getCurrentDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

const estados = ['Abierto', 'En Progreso', 'Cerrado'];

const calculateSolutionDate = (criticidad: string): string => {
  const today = new Date();
  let daysToAdd = 0;

  if (criticidad === 'green') {
    daysToAdd = 45;
  } else if (criticidad === 'yellow') {
    daysToAdd = 30;
  } else if (criticidad === 'red') {
    daysToAdd = 15;
  }

  const solutionDate = new Date(today.setDate(today.getDate() + daysToAdd));
  const dd = String(solutionDate.getDate()).padStart(2, '0');
  const mm = String(solutionDate.getMonth() + 1).padStart(2, '0');
  const yyyy = solutionDate.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state, addDesviacion } = context;

  const [selectedRows, setSelectedRows] = useState<ISelectedRow[]>([]);
  const [accionesCorrectivas, setAccionesCorrectivas] = useState<any[]>([]);

  // Llamar a la API para obtener las acciones correctivas al montar el componente
  useEffect(() => {
    const fetchAccionesCorrectivas = async () => {
      const acciones = await obtenerTodasLasAccionesDesdeAPI();
      setAccionesCorrectivas(acciones); // Actualizar el estado con los datos obtenidos
    };
    fetchAccionesCorrectivas();
  }, []);

  const addAllRows = useCallback(() => {
    const email = state.auditSheetData.auditorEmail;
    const auditor = state.userName || '';
    const nombreEstablecimiento = state.auditSheetData.nombreEstablecimiento;
    const responsableDelProblema = state.auditSheetData.supervisorEstablecimiento;

    const rowsToAdd = state.IsHero
      .filter((hero) => extractPercentage(hero.answer ?? DEFAULT_ANSWER) < 100)
      .map((hero) => {
        const criticidadColor = getColorByPercentage(extractPercentage(hero.answer ?? DEFAULT_ANSWER));
        const solucionProgramada = calculateSolutionDate(criticidadColor);
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
          estado: 'Abierto'
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
            <th>FECHA DE INGRESO</th>
            <th>AUDITOR</th>
            <th>EMAIL</th>
            <th>NOMBRE DEL ESTABLECIMIENTO</th>
            <th>CRITICIDAD</th>
            <th>ACCIONES CORRECTIVAS</th>
            <th>RESPONSABLE</th>
            <th>FECHA DE RECEPCION</th>
            <th>SOLUCION PROGRAMADA</th>
            <th>ESTADO</th>
            <th>CONTACTO CLIENTE</th>
            <th>ELIMINAR FILA</th>
          </tr>
        </thead>
        <tbody>
          {selectedRows.map((row, index) => (
            <tr key={row.numeroRequerimiento}>
              <td>{row.numeroRequerimiento}</td>
              <td>{row.pregunta}</td>
              <td>{row.respuesta}</td>
              <td>{row.fecha}</td>
              <td>{row.auditor}</td>
              <td>{row.email}</td>
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
              <td>{row.responsableDelProblema}</td>
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
              <td>
                <input
                  type="text"
                  value={row.contactoCliente || ''}
                  onChange={(e) => handleClientContactChange(index, e.target.value)}
                />
              </td>
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
