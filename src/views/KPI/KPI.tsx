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
    <div className="kpi-container">
      <h3>Resumen KPI</h3>
      <p>Numero Auditoria: {numeroAuditoria}</p>
      {loading && <p>Cargando datos...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <KPIGraph moduleData={moduleData} />
          <button onClick={handleGoToDoc}>Volver</button>
        </>
      )}
    </div>
  );
};

export default KPI;
