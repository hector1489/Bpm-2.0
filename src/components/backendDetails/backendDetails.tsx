import { useState } from 'react';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

const BackendDetails: React.FC = () => {
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditoriaNumber, setAuditoriaNumber] = useState<string>('');


  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTablaDetailsByNumeroAuditoria(auditoriaNumber);
      setTablaDetails(data);
    } catch (err) {
      setError('Error al obtener los datos de la tabla');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Detalles de la Tabla</h1>

      <div>
        <label htmlFor="auditoriaNumber">Número de Auditoría:</label>
        <input
          type="text"
          id="auditoriaNumber"
          value={auditoriaNumber}
          onChange={(e) => setAuditoriaNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {tablaDetails.length === 0 ? (
        <p>No se encontraron registros</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Número de Auditoría</th>
              <th>Campo 1</th>
              <th>Campo 2</th>
              <th>Campo 3</th>
              <th>Campo 4</th>
            </tr>
          </thead>
          <tbody>
            {tablaDetails.map((detail) => (
              <tr key={detail.numero_auditoria}>
                <td>{detail.numero_auditoria}</td>
                <td>{detail.field1}</td>
                <td>{detail.field2}</td>
                <td>{detail.field3}</td>
                <td>{detail.field4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BackendDetails;
