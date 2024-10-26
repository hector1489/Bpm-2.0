import React from 'react';
import './TableDetailsSummary.css';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';

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
  const [tablaDetails, setTablaDetails] = useState<{ [key: string]: TablaDetail[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  console.log(tablaDetails);

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
        const groupedData = data.reduce((acc: { [key: string]: TablaDetail[] }, detail: TablaDetail) => {
          const module = detail.field2; 
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

  

  // Función para calcular el promedio de desviaciones de un módulo
  const calculateModuleAverage = (moduleData: TablaDetail[]) => {
    const desviaciones = moduleData
      .map((detail) => parseFloat(detail.field4))
      .filter((desviacion) => !isNaN(desviacion));  // Filtramos valores no numéricos
    const total = desviaciones.reduce((acc, desviacion) => acc + desviacion, 0);
    return desviaciones.length > 0 ? (total / desviaciones.length).toFixed(2) : 'N/A';
  };

  return (
    <div className='table-details-summary'>
     
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
                const moduleAverage = calculateModuleAverage(moduloData);

                return (
                  <React.Fragment key={modulo}>
                    {moduloData.map((detail, index) => (
                      <tr key={detail.numero_auditoria + detail.field1}>
                        {index === 0 && (
                          <td rowSpan={moduloData.length + 1}>{modulo}</td>
                        )}
                        <td>{detail.numero_auditoria}</td>
                        <td>{detail.field1}</td>
                        <td>{detail.field3}</td>
                        <td>{detail.field4}</td>
                      </tr>
                    ))}
                    <tr className="TableDetailsSummary-module-average" key={`${modulo}-average`}>
                      <td colSpan={3} style={{ fontWeight: 'bold', textAlign: 'right' }}>Promedio del Módulo:</td>
                      <td style={{ fontWeight: 'bold' }}>{moduleAverage}</td>
                    </tr>
                  </React.Fragment>
                );
              })}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableDetailsSummary;
