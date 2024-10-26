import './TableDetailsDD.css';
import { DetailsAverageSummary, TableDetailsSummary } from '../../components';
import { AppContext } from '../../context/GlobalState';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getColorByPercentageFilas } from '../../utils/utils'

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

const TableDetailsDD: React.FC = () => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
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

  // Función para obtener los detalles de la tabla
  const fetchTablaDetails = useCallback(async () => {
    if (!numeroAuditoria) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
      setTablaDetails(data);
    } catch (err) {
      setError('Error al obtener los datos de la tabla');
    } finally {
      setLoading(false);
    }
  }, [numeroAuditoria]);

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

  useEffect(() => {
    fetchTablaDetails();
  }, [fetchTablaDetails]);

 

  // Función para extraer el porcentaje del campo field4
  const extractPercentage = (answer: string): number => {
    const match = answer.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Preparar datos del módulo
  const moduleData = useMemo(() => {
    return tablaDetails.map((detail) => ({
      moduleName: detail.field2,
      percentage: extractPercentage(detail.field4),
    }));
  }, [tablaDetails]);


  // Grupos de módulos
  const moduleGroups = {
    BPM: ['infraestructura', 'legales'],
    POES: [
      'poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada',
      'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'
    ],
    POE: [
      'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
      'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
    ],
    MA: ['MA'],
    DOC: ['doc'],
    LUM: ['poes-superficies'],
    TRA: [
      'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
      'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
    ]
  };

  // Calcular promedio por grupo de módulos
  const calculateGroupAverage = useCallback((modules: string[]): number => {
    const relevantModules = moduleData.filter((mod) => modules.includes(mod.moduleName));
    const totalPercentage = relevantModules.reduce((acc, curr) => acc + curr.percentage, 0);
    return relevantModules.length > 0 ? totalPercentage / relevantModules.length : 100;
  }, [moduleData]);

  // Datos agrupados
  const groupedData = useMemo(() => {
    return Object.entries(moduleGroups).map(([groupName, modules]) => ({
      groupName,
      average: calculateGroupAverage(modules).toFixed(2),
    }));
  }, [calculateGroupAverage]);

  // Promedio final de todos los grupos
  const finalAverage = useMemo(() => {
    const totalPercentage = groupedData.reduce((acc, group) => acc + parseFloat(group.average), 0);
    return (totalPercentage / groupedData.length).toFixed(2);
  }, [groupedData]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!filteredAuditSheet) {
    return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;
  }


  const backgroundColor = getColorByPercentageFilas(parseFloat(finalAverage));

  let textColor = 'black';
  if (backgroundColor === 'red') {
    textColor = 'white';
  } else if (backgroundColor === 'yellow') {
    textColor = 'black';
  }


  return (
    <div className="TableDetailsDD-container">
      <h3>Detalles de la Auditoría</h3>

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


          <p className="TableDetailsDD-general-average" style={{ backgroundColor, color: textColor }}>
            Promedio : <strong>{finalAverage}</strong>
          </p>


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
