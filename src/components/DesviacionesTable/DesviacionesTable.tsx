import './DesviacionesTable.css'
import { useContext, useState, useCallback } from 'react'
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
}

const DEFAULT_ANSWER = "Sin respuesta";

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

const DesviacionesTable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state, addDesviacion } = context;

  const [selectedRows, setSelectedRows] = useState<ISelectedRow[]>([]);

  const addAllRows = useCallback(() => {
    const email = state.auditSheetData.auditorEmail;
    const auditor = state.userName || '';
    const nombreEstablecimiento = state.auditSheetData.nombreEstablecimiento;
    const responsableDelProblema = state.auditSheetData.supervisorEstablecimiento;

    const rowsToAdd = state.IsHero
      .filter((hero) => extractPercentage(hero.answer ?? DEFAULT_ANSWER) < 100)
      .map((hero) => ({
        numeroRequerimiento: hero.id,
        pregunta: hero.question,
        respuesta: hero.answer ?? DEFAULT_ANSWER,
        fecha: getCurrentDate(),
        auditor: auditor,
        email: email,
        nombreEstablecimiento: nombreEstablecimiento,
        responsableDelProblema
      }));

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
            <th>RESPONSABLE</th>
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
              <td>{row.responsableDelProblema}</td>
              <td>
                <button onClick={() => removeRow(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons-desviaciones">
        <button onClick={saveDesviaciones}>Guardar Desviaciones</button>
        <button onClick={addAllRows}>Agregar todas las desviaciones</button>
      </div>
    </div>
  )
}

export default DesviacionesTable;
