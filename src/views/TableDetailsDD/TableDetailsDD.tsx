import './TableDetailsDD.css';
import { DetailsAverageSummary, TableDetailsSummary } from '../../components';
import { AppContext } from '../../context/GlobalState';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getColorByPercentageFilas } from '../../utils/utils'
import {
  questionsBPM,
  questionsPOES,
  questionsPOE,
  questionsMA,
  questionsDOC,
  questionsTra,
  questionLum
} from '../../utils/ConstModules';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

type ModuleGroupName = 'BPM' | 'POES' | 'POE' | 'MA' | 'DOC' | 'LUM' | 'TRA';

// Definición de ponderaciones para cada grupo de módulos
const ponderaciones: Record<string, number> = {
  BPM: 4,
  POES: 25,
  POE: 25,
  MA: 4,
  DOC: 10,
  LUM: 10,
  TRA: 21
};

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



  // Filter for each module
  const filterModuleDetails = (questions: string[]) => {
    return tablaDetails
      .filter(detail => questions.includes(detail.field3))
      .filter((detail, index, self) =>
        index === self.findIndex(d => d.field3 === detail.field3)
      )
      .map(detail => parseFloat(detail.field4.replace('%', '')) || 0);
  };

  // Individual module calculations
  const calculateGeneralAverage = (percentages: number[]) => {
    const total = percentages.reduce((acc, percentage) => acc + percentage, 0);
    return percentages.length > 0 ? (total / percentages.length).toFixed(2) : 'N/A';
  };

  // Module-specific data extraction and average calculations
  const calculateBPM = () => calculateGeneralAverage(filterModuleDetails(questionsBPM));
  const calculatePOES = () => calculateGeneralAverage(filterModuleDetails(questionsPOES));
  const calculatePOE = () => calculateGeneralAverage(filterModuleDetails(questionsPOE));
  const calculateMA = () => calculateGeneralAverage(filterModuleDetails(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleDetails(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleDetails(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleDetails(questionsTra));

  const groupedData = useMemo(() => {
    return [
      { groupName: 'BPM', average: calculateBPM(), ponderacion: ponderaciones['BPM'] },
      { groupName: 'POES', average: calculatePOES(), ponderacion: ponderaciones['POES'] },
      { groupName: 'POE', average: calculatePOE(), ponderacion: ponderaciones['POE'] },
      { groupName: 'MA', average: calculateMA(), ponderacion: ponderaciones['MA'] },
      { groupName: 'DOC', average: calculateDOC(), ponderacion: ponderaciones['DOC'] },
      { groupName: 'LUM', average: calculateLUM(), ponderacion: ponderaciones['LUM'] },
      { groupName: 'TRA', average: calculateTRA(), ponderacion: ponderaciones['TRA'] },
    ];
  }, [tablaDetails]);

  const finalAverage = useMemo(() => {
    const weightedSum = groupedData
      .filter(group => group.groupName !== 'TRA' && group.groupName !== 'LUM')
      .reduce((acc, group) => acc + parseFloat(group.average) * group.ponderacion, 0);

    const totalWeight = Object.keys(ponderaciones)
      .filter(key => key !== 'TRA' && key !== 'LUM')
      .reduce((acc, key) => acc + ponderaciones[key as ModuleGroupName], 0);

    return (weightedSum / totalWeight).toFixed(2);
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
