import React, { useState, useEffect } from 'react';
import { getAllTablaDetails } from '../../utils/apiDetails';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

const BackendDetails: React.FC = () => {
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getAllTablaDetails();
        setTablaDetails(data);
      } catch (err) {
        setError('Error al obtener los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Detalles de la Tabla</h1>
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
