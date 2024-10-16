import './TableDetailsSummary.css'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/GlobalState'
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails'

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface TableDetailsSummaryProps {
  numeroAuditoria: string | null;
}

const TableDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
        const sortedData = data.sort((a: TablaDetail, b: TablaDetail) => a.field1.localeCompare(b.field1));
        setTablaDetails(sortedData);
      } catch (err) {
        setError('Error al obtener los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };

    fetchTablaDetails();
  }, [numeroAuditoria]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='table-details-summary'>
      <h3>detalles de la auditoria</h3>
      {tablaDetails.length === 0 ? (
        <p>No se encontraron registros</p>
      ) : (
        <table className='table-details-summary'>
          <thead>
            <tr>
              <th>Número de Auditoría</th>
              <th>ID Pregunta</th>
              <th>Modulo</th>
              <th>Pregunta</th>
              <th>Desviacion</th>
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

export default TableDetailsSummary;
