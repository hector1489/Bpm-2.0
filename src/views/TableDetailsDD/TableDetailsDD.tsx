import { DetailsAverageSummary, TableDetailsSummary } from '../../components'
import './TableDetailsDD.css'
import { AppContext } from '../../context/GlobalState'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';

const TableDetailsDD: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const numeroAuditoria = location.state?.numero_requerimiento;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditSheetDetails, setAuditSheetDetails] = useState<any[]>([]);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<any | null>(null);

  if (!context) {
    return <div>Error: Context no está disponible.</div>;
  }

  const { state } = context;

  const handleGoToDoc = () => {
    navigate('/documentacion');
  };

  const fetchAuditSheetDetails = async () => {
    const username = state?.userName;
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const auditSheetData = await getAuditSheetByUsername(username);
      setAuditSheetDetails(auditSheetData);
    } catch (err) {
      setError('Error al obtener los datos del audit sheet');
    } finally {
      setLoading(false);
    }
  };

  const bpmFilteredAuditSheet = () => {
    if (numeroAuditoria && auditSheetDetails) {
      const filteredData = auditSheetDetails.find(
        (sheet) => sheet.numero_auditoria === numeroAuditoria
      );
      setFilteredAuditSheet(filteredData || null);
    }
  };

  useEffect(() => {
    fetchAuditSheetDetails();
  }, [context?.state?.userName]);

  useEffect(() => {
    bpmFilteredAuditSheet();
  }, [auditSheetDetails, numeroAuditoria]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!filteredAuditSheet) {
    return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;
  }

  return (
    <div className="TableDetailsDD-container">
      <p>Vista para descarga</p>

      <div className="BPMDetailsSummary-data">

        <div className="BPMDetailsSummary-data-table">
          <table>
            <thead>
              <tr>
                <th>Nombre del Establecimiento:</th>
                <td>{filteredAuditSheet?.field1 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Número de Auditoría:</th>
                <td>{filteredAuditSheet?.numero_auditoria || 'N/A'}</td>
              </tr>
              <tr>
                <th>Gerente del Establecimiento:</th>
                <td>{filteredAuditSheet?.field2 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Administrador del Establecimiento:</th>
                <td>{filteredAuditSheet?.field3 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Supervisor del Establecimiento:</th>
                <td>{filteredAuditSheet?.field4 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Auditor Email:</th>
                <td>{filteredAuditSheet?.field5 || 'N/A'}</td>
              </tr>
              <tr>
                <th>Fecha de Auditoría:</th>
                <td>{filteredAuditSheet?.field6 || 'N/A'}</td>
              </tr>
            </thead>
          </table>
        </div>

        <div className="BPMDetailsSummary-data-promedio">
          <div style={{ fontSize: 'smaller', marginTop: '10px' }}>
            <div
              style={{
                backgroundColor: 'green',
                padding: '5px',
                border: '1px solid black',
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              CUMPLE 90% - 100%
            </div>
            <div
              style={{
                backgroundColor: 'yellow',
                padding: '5px',
                border: '1px solid black',
                marginTop: '5px',
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              EN ALERTA 75% - 89%
            </div>
            <div
              style={{
                backgroundColor: 'red',
                padding: '5px',
                border: '1px solid black',
                marginTop: '5px',
                width: '100%',
                borderRadius: '5px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              CRITICO 0% - 74%
            </div>
          </div>
        </div>
      </div>

      <TableDetailsSummary numeroAuditoria={numeroAuditoria} />
      <DetailsAverageSummary numeroAuditoria={numeroAuditoria} />

      <div className="TableDetailsDD-buttons">
        <button onClick={handleGoToDoc}>Volver</button>
      </div>
    </div>
  );
};

export default TableDetailsDD;
