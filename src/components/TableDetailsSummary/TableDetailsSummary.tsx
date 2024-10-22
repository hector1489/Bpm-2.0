import './TableDetailsSummary.css'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/GlobalState'
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails'

interface TablaDetail {
  numero_auditoria: string;
  field1: string;  // ID Pregunta
  field2: string;  // Módulo
  field3: string;  // Pregunta
  field4: string;  // Desviación
}

interface TableDetailsSummaryProps {
  numeroAuditoria: string | null;
}

const TableDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<{ [key: string]: TablaDetail[] }>({});
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
        // Agrupar los detalles por el campo `field2` (Módulo) y filtrar las preguntas duplicadas por `field1`
        const groupedData = data.reduce((acc: { [key: string]: TablaDetail[] }, detail: TablaDetail) => {
          const module = detail.field2;  // Agrupamos por Módulo
          if (!acc[module]) {
            acc[module] = [];
          }

          // Filtrar duplicados basado en el ID Pregunta (`field1`)
          const exists = acc[module].some(item => item.field1 === detail.field1);
          if (!exists) {
            acc[module].push(detail);
          }
          
          return acc;
        }, {});

        setTablaDetails(groupedData);
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
      <h3>Detalles de la Auditoría</h3>
      {Object.keys(tablaDetails).length === 0 ? (
        <p>No se encontraron registros</p>
      ) : (
        <div>
          <table className='table-details-summary'>
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Número de Auditoría</th>
                <th>ID Pregunta</th>
                <th>Pregunta</th>
                <th>Desviación</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tablaDetails).map((modulo) => {
                const moduloData = tablaDetails[modulo];
                return moduloData.map((detail, index) => (
                  <tr key={detail.numero_auditoria + detail.field1}>
                    {/* Solo mostrar el nombre del módulo en la primera fila del grupo */}
                    {index === 0 && (
                      <td rowSpan={moduloData.length}>{modulo}</td>
                    )}
                    <td>{detail.numero_auditoria}</td>
                    <td>{detail.field1}</td>
                    <td>{detail.field3}</td>
                    <td>{detail.field4}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableDetailsSummary;
