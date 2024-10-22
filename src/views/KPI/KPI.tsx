import { KPIGraph } from '../../components';
import { useNavigate, useLocation } from 'react-router-dom';  // Asegúrate de importar useLocation
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import './KPI.css';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

const KPI: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const numeroAuditoria = location.state?.numero_requerimiento || null;

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
        console.log(data);
        setTablaDetails(data);
      } catch (err) {
        setError('Error al obtener los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };

    fetchTablaDetails();
  }, [numeroAuditoria]);

  const moduleData = tablaDetails.map((detail) => ({
    moduleName: detail.field2,
    percentage: Number(detail.field4) || null,
  }));

  const handleGoToDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="kpi-view">
      <div className="kpi-container">
        <h3>Resumen KPI</h3>
        <p>Numero Auditoria: {numeroAuditoria}</p>
        <div className="BPMDetailsSummary-data">

          <div className="BPMDetailsSummary-data-table">

            <table>
              <thead>
                <tr>
                  <th>Nombre del Establecimiento:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Número de Auditoría:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Gerente del Establecimiento:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Administrador del Establecimiento:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Supervisor del Establecimiento:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Auditor Email:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Fecha:</th>
                  <td>
                    <span id="resumen-nombre-establecimiento" className="resumen-span">
                      { }
                    </span>
                  </td>
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
        
        {loading && <p>Cargando datos...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <>
            <KPIGraph moduleData={moduleData} />

          </>
        )}
      </div>

      <div className="kpi-view-buttons">
        <button onClick={handleGoToDoc}>Volver</button>
      </div>
    </div>
  );
};

export default KPI;
