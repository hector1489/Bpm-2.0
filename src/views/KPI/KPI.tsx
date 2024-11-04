import { KPIGraph } from '../../components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';
import { getColorByPercentageFilas } from '../../utils/utils'
import './KPI.css';
import {
  questionsMA,
  questionsDOC,
  questionsTra,
  questionLum,
  infraestructuraQuestions,
  legalesQuestions,
  poesControlProductosQuestion,
  poesAguaQuestion,
  poesSuperficiesQuestions,
  poesContaminacionCruzadaQuestions,
  poesSustanciasAdulterantes,
  poesHigieneEmpleadosQuestions,
  poesControlPlagas,
  poesInstalacionesQuestions,
  poeRecepcionQuestions,
  poeAlamacenaminetoQuestions,
  poePreelaboracionesQuestions,
  poeElaboracionesQuestions,
  poeTransporteQuestions,
  poeServicioQuestions,
  poeLavadoOllasQuestions,
  poeControlCalidadQiestions,
  poePptQuestions,
} from '../../utils/ConstModules'


interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface AuditSheet {
  username: string;
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
}


type ModuleGroupName = 'BPM' | 'POES' | 'POE' | 'MA' | 'DOC' | 'LUM' | 'TRA';

const KPI: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const numeroAuditoria = location.state?.numero_requerimiento || null;
  const userName = location.state?.userName || null;

  const ponderaciones: Record<ModuleGroupName, number> = {
    BPM: 4,
    POES: 25,
    POE: 25,
    MA: 4,
    DOC: 10,
    LUM: 10,
    TRA: 21
  };

  useEffect(() => {
    const fetchTablaDetails = async () => {
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
    };

    fetchTablaDetails();
  }, [numeroAuditoria]);

  useEffect(() => {
    const fetchAuditSheetDetails = async () => {
      const username = userName;
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

    fetchAuditSheetDetails();
  }, [context?.state?.userName]);

  useEffect(() => {
    const bpmFilteredAuditSheet = () => {
      if (numeroAuditoria && auditSheetDetails) {
        const filteredData = auditSheetDetails.find(
          (sheet) => sheet.numero_auditoria === numeroAuditoria
        );
        setFilteredAuditSheet(filteredData || null);
      }
    };
    bpmFilteredAuditSheet();
  }, [auditSheetDetails, numeroAuditoria]);

  const moduleData = tablaDetails.map((detail) => ({
    question: detail.field3,
    answer: detail.field4,
    moduleName: detail.field2,
    percentage: Number(detail.field4) || null,
  }));

  // Function to calculate a specific submodule's average with error handling
  const calculateGeneralAverage = (percentages: number[]): string => {
    const validPercentages = percentages.filter((value) => !isNaN(value) && value !== null);
    const total = validPercentages.reduce((acc, percentage) => acc + percentage, 0);
    return validPercentages.length > 0 ? (total / validPercentages.length).toFixed(2) : 'N/A';
  };
  

  // Filtra y convierte datos de un submódulo específico
  const calculateSubmoduleAverageBpm = (submoduleQuestions: string[]): string => {
    const submoduleData = moduleData
      .filter((data) => submoduleQuestions.includes(data.question) && data.answer !== 'N/A')
      .map((data) => parseFloat(data.answer.replace('%', '')) || 0);
    return calculateGeneralAverage(submoduleData);
  };
  

  const filterModuleData = (questions: string[]): number[] => {
    return moduleData
      .filter(data => questions.includes(data.question))
      .map(data => {
        const percentage = parseFloat(data.answer.replace('%', ''));
        return isNaN(percentage) ? NaN : percentage;
      })
      .filter(value => !isNaN(value));
  };

  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = filterModuleData(submoduleQuestions);
    return calculateGeneralAverage(submoduleData);
  };


  const calculateBPM = (): string => {
    const infraAverage = parseFloat(calculateSubmoduleAverageBpm(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverageBpm(legalesQuestions));
  
    const validAverages = [infraAverage, legalesAverage].filter((avg) => !isNaN(avg) && avg !== null);
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
  };
  
  const calculatePOES = () => {
    const poesAverages = [
      calculateSubmoduleAverage(poesControlProductosQuestion),
      calculateSubmoduleAverage(poesAguaQuestion),
      calculateSubmoduleAverage(poesSuperficiesQuestions),
      calculateSubmoduleAverage(poesContaminacionCruzadaQuestions),
      calculateSubmoduleAverage(poesSustanciasAdulterantes),
      calculateSubmoduleAverage(poesHigieneEmpleadosQuestions),
      calculateSubmoduleAverage(poesControlPlagas),
      calculateSubmoduleAverage(poesInstalacionesQuestions),
    ].map((avg) => parseFloat(avg)).filter((avg) => !isNaN(avg));
  
    const total = poesAverages.reduce((acc, avg) => acc + avg, 0);
    return poesAverages.length > 0 ? (total / poesAverages.length).toFixed(2) : 'N/A';
  };
  
  const calculatePOE = () => {
    const poeAverages = [
      calculateSubmoduleAverageBpm(poeRecepcionQuestions),
      calculateSubmoduleAverageBpm(poeAlamacenaminetoQuestions),
      calculateSubmoduleAverageBpm(poePreelaboracionesQuestions),
      calculateSubmoduleAverageBpm(poeElaboracionesQuestions),
      calculateSubmoduleAverageBpm(poeTransporteQuestions),
      calculateSubmoduleAverageBpm(poeServicioQuestions),
      calculateSubmoduleAverageBpm(poeLavadoOllasQuestions),
      calculateSubmoduleAverageBpm(poeControlCalidadQiestions),
      calculateSubmoduleAverageBpm(poePptQuestions),
    ].map((avg) => parseFloat(avg)).filter((avg) => !isNaN(avg));
  
    const total = poeAverages.reduce((acc, avg) => acc + avg, 0);
    return poeAverages.length > 0 ? (total / poeAverages.length).toFixed(2) : 'N/A';
  };
  

  const calculateMA = () => calculateGeneralAverage(filterModuleData(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleData(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleData(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleData(questionsTra));



  const groupedData = useMemo(() => {
    return [
      { groupName: 'BPM', percentage: ponderaciones.BPM, average: calculateBPM() },
      { groupName: 'POES', percentage: ponderaciones.POES, average: calculatePOES() },
      { groupName: 'POE', percentage: ponderaciones.POE, average: calculatePOE() },
      { groupName: 'MA', percentage: ponderaciones.MA, average: calculateMA() },
      { groupName: 'DOC', percentage: ponderaciones.DOC, average: calculateDOC() },
      { groupName: 'TRA', percentage: ponderaciones.TRA, average: calculateTRA() },
      { groupName: 'LUM', percentage: ponderaciones.LUM, average: calculateLUM() },
    ];
  }, [moduleData]);

  const finalAverageBPM = useMemo(() => {
    const validAverages = groupedData
      .map((group) => parseFloat(group.average))
      .filter((avg) => !isNaN(avg));
    const total = validAverages.reduce((acc, avg) => acc + avg, 0);
    return validAverages.length > 0 ? (total / validAverages.length).toFixed(2) : 'N/A';
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



  const handleGoToDoc = () => {
    navigate('/documentacion');
  };


  const extractPercentageFromAnswer = (answer: string): number | null => {
    if (answer === 'N/A') return null;
    const match = answer.match(/(\d+)%/);
    return match ? parseInt(match[1]) : null;
  };





  const bpmPercentage = finalAverageBPM;


  // Buscar y extraer los porcentajes de las preguntas específicas
  const doc97Detail = moduleData.find((module) =>
    module.question === 'DOC 97. Informes de muestreo microbiológico/luminometría. Planes de acción, charlas al personal si corresponde:'
  );
  const doc97Percentage = doc97Detail ? extractPercentageFromAnswer(doc97Detail.answer) : null;

  const csh31Detail = moduleData.find((module) =>
    module.question === 'TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):'
  );
  const csh31Percentage = csh31Detail ? extractPercentageFromAnswer(csh31Detail.answer) : null;

  const ser71Detail = moduleData.find((module) =>
    module.question === 'SER 71. Variedad de alternativas instaladas en línea autoservicio, según menú (fondos, ensaladas y postres, otros):'
  );
  const ser71Percentage = ser71Detail ? extractPercentageFromAnswer(ser71Detail.answer) : null;

  const cap101Detail = moduleData.find((module) =>
    module.question === 'CAP 101. Existe un programa escrito y con sus registros correspondientes de capacitación del personal en materia de manipulación higiénica de los alimentos e higiene personal. (Art. 52, 69)'
  );
  const cap101Percentage = cap101Detail ? extractPercentageFromAnswer(cap101Detail.answer) : null;

  // Actualización de validAverages para asegurar que todos los elementos sean números
  const validAverages = [bpmPercentage, doc97Percentage, csh31Percentage, ser71Percentage, cap101Percentage]
    .filter((avg) => avg !== null)
    .map((avg) => typeof avg === 'string' ? parseFloat(avg) : avg);

  // Calcular el promedio general de los valores filtrados
  const promedioGeneral = validAverages.length > 0
    ? (validAverages.reduce((acc, avg) => acc + (avg ?? 0), 0) / validAverages.length)
    : null;


  const backgroundColor = getColorByPercentageFilas(promedioGeneral ?? 0);


  let textColor = 'black';
  if (backgroundColor === 'red') {
    textColor = 'white';
  } else if (backgroundColor === 'yellow') {
    textColor = 'black';
  } else if (backgroundColor === 'green') {
    textColor = 'white';
  }

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

            <p className="kpi-general-average" style={{ backgroundColor, color: textColor }}>
              Promedio : <strong>{promedioGeneral !== null ? promedioGeneral.toFixed(2) + '%' : 'N/A'} </strong>
            </p>

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
