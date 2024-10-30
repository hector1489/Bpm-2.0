import './BPMDetailsSummary.css';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';
import { getColorByPercentage, getColorByPercentageFilas } from '../../utils/utils';
import {
  questionsPOE,
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
  poesInstalacionesQuestions 
} from '../../utils/ConstModules';

if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}

type ModuleGroupName = 'BPM' | 'POES' | 'POE' | 'MA' | 'DOC' | 'LUM' | 'TRA';

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

const BPMDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context?.state) {
    return <div>Error al cargar el contexto</div>;
  }

  const nombreCompletoPorGrupo: Record<ModuleGroupName, string> = {
    BPM: 'Buenas Prácticas de Manufactura',
    POES: 'Procedimientos Operacionales Estandarizados de Saneamiento',
    POE: 'Procedimientos Operacionales Estandarizados',
    MA: 'Medio Ambiente',
    DOC: 'Documentación',
    TRA: 'Transporte',
    LUM: 'Luminometría',
  };

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
      const username = context.state?.userName;
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
  }, [context.state?.userName]);

  useEffect(() => {
    if (numeroAuditoria && auditSheetDetails) {
      const filteredData = auditSheetDetails.find(
        (sheet) => sheet.numero_auditoria === numeroAuditoria
      );
      setFilteredAuditSheet(filteredData || null);
    }
  }, [auditSheetDetails, numeroAuditoria]);

  // Filter for each module
  const filterModuleDetails = (questions: string[]) => {
    return tablaDetails
      .filter(detail => questions.includes(detail.field3))
      .filter((detail, index, self) =>
        index === self.findIndex(d => d.field3 === detail.field3)
      )
      .map(detail => parseFloat(detail.field4.replace('%', '')) || 0);
  };


  const calculateGeneralAverage = (percentages: number[]) => {
    const total = percentages.reduce((acc, percentage) => acc + percentage, 0);
    return percentages.length > 0 ? (total / percentages.length).toFixed(2) : 'N/A';
  };

  // Función para filtrar y calcular el promedio de un submódulo específico
  const calculateSubmoduleAverage = (submoduleQuestions: string[]) => {
    const submoduleData = tablaDetails
      .filter(detail => submoduleQuestions.includes(detail.field3))
      .map(detail => parseFloat(detail.field4.replace('%', '')) || 0);

    const total = submoduleData.reduce((acc, percentage) => acc + percentage, 0);
    return submoduleData.length > 0 ? (total / submoduleData.length).toFixed(2) : 'N/A';
  };


  // Module-specific data extraction and average calculations
  const calculateBPM = () => {
    const infraAverage = parseFloat(calculateSubmoduleAverage(infraestructuraQuestions));
    const legalesAverage = parseFloat(calculateSubmoduleAverage(legalesQuestions));

    return ((infraAverage + legalesAverage) / 2).toFixed(2);
  };

  const calculatePOES = () => {
    const poesControlAverage = parseFloat(calculateSubmoduleAverage(poesControlProductosQuestion));
    const poesAguaAverage = parseFloat(calculateSubmoduleAverage(poesAguaQuestion));
    const poesSuperficiesAverage = parseFloat(calculateSubmoduleAverage(poesSuperficiesQuestions));
    const poesContaminacionCruzadaAverage = parseFloat(calculateSubmoduleAverage(poesContaminacionCruzadaQuestions));
    const poesSustanciasAverage = parseFloat(calculateSubmoduleAverage( poesSustanciasAdulterantes));
    const poesHigieneEmpleadosAverage =  parseFloat(calculateSubmoduleAverage(poesHigieneEmpleadosQuestions));
    const poesControlPlagasAverage = parseFloat(calculateSubmoduleAverage(poesControlPlagas));
    const poesInstalacionesAverage = parseFloat(calculateSubmoduleAverage(poesInstalacionesQuestions));
    
    return ((poesControlAverage + poesAguaAverage + poesSuperficiesAverage + poesContaminacionCruzadaAverage + poesSustanciasAverage + poesHigieneEmpleadosAverage + poesControlPlagasAverage + poesInstalacionesAverage) / 8).toFixed(2);
  };

  const calculatePOE = () => calculateGeneralAverage(filterModuleDetails(questionsPOE));
  const calculateMA = () => calculateGeneralAverage(filterModuleDetails(questionsMA));
  const calculateDOC = () => calculateGeneralAverage(filterModuleDetails(questionsDOC));
  const calculateLUM = () => calculateGeneralAverage(filterModuleDetails(questionLum));
  const calculateTRA = () => calculateGeneralAverage(filterModuleDetails(questionsTra));


  const groupedData = useMemo(() => {
    return [
      { groupName: 'BPM', nombreCompleto: nombreCompletoPorGrupo['BPM'], percentage: ponderaciones.BPM, average: calculateBPM(), ponderacion: ponderaciones['BPM'] },
      { groupName: 'POES', nombreCompleto: nombreCompletoPorGrupo['POES'], percentage: ponderaciones.POES, average: calculatePOES(), ponderacion: ponderaciones['POES'] },
      { groupName: 'POE', nombreCompleto: nombreCompletoPorGrupo['POE'], percentage: ponderaciones.POE, average: calculatePOE(), ponderacion: ponderaciones['POE'] },
      { groupName: 'MA', nombreCompleto: nombreCompletoPorGrupo['MA'], percentage: ponderaciones.MA, average: calculateMA(), ponderacion: ponderaciones['MA'] },
      { groupName: 'DOC', nombreCompleto: nombreCompletoPorGrupo['DOC'], percentage: ponderaciones.DOC, average: calculateDOC(), ponderacion: ponderaciones['DOC'] },
      { groupName: 'TRA', nombreCompleto: nombreCompletoPorGrupo['TRA'], percentage: ponderaciones.TRA, average: calculateTRA(), ponderacion: ponderaciones['TRA'] },
      { groupName: 'LUM', nombreCompleto: nombreCompletoPorGrupo['LUM'], percentage: ponderaciones.LUM, average: calculateLUM(), ponderacion: ponderaciones['LUM'] },
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

  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
      reflow: true,
    },
    title: { text: 'Promedios por Módulo' },
    xAxis: {
      categories: [...groupedData.map(g => g.groupName), 'PROM']
    },
    yAxis: { title: { text: 'Porcentaje (%)' } },
    series: [
      {
        name: 'Promedio',
        data: [...groupedData.map(g => parseFloat(g.average)), parseFloat(finalAverage)],
        colorByPoint: true,
        colors: groupedData.map(g => getColorByPercentage(parseFloat(g.average))),
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
          inside: false,
          style: { fontWeight: 'bold', color: 'black' },
        },
      },
    ],
  };

  const backgroundColor = getColorByPercentageFilas(parseFloat(finalAverage));
  const textColor = backgroundColor === 'red' ? 'white' : 'black';

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;
  if (!filteredAuditSheet) return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;

  return (
    <div className="BPMDetailsSummary-container">
      <h3>Gráfico BPM Auditoría: {numeroAuditoria}</h3>

      <div className="BPMDetailsSummary-data">
        <div className="BPMDetailsSummary-data-table">
          <table>
            <thead>
              <tr><th>Nombre del Establecimiento:</th><td>{filteredAuditSheet?.field1 || 'N/A'}</td></tr>
              <tr><th>Número de Auditoría:</th><td>{filteredAuditSheet?.numero_auditoria || 'N/A'}</td></tr>
              <tr><th>Gerente del Establecimiento:</th><td>{filteredAuditSheet?.field2 || 'N/A'}</td></tr>
              <tr><th>Administrador del Establecimiento:</th><td>{filteredAuditSheet?.field3 || 'N/A'}</td></tr>
              <tr><th>Supervisor del Establecimiento:</th><td>{filteredAuditSheet?.field4 || 'N/A'}</td></tr>
              <tr><th>Auditor Email:</th><td>{filteredAuditSheet?.field5 || 'N/A'}</td></tr>
              <tr><th>Fecha de Auditoría:</th><td>{filteredAuditSheet?.field6 || 'N/A'}</td></tr>
            </thead>
          </table>
        </div>

        <div className="BPMDetailsSummary-cumplimientos">
          <div style={{ fontSize: 'smaller', marginTop: '10px' }}>
            <div style={{ backgroundColor: 'green', padding: '5px', border: '1px solid black', width: '100%', borderRadius: '5px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>CUMPLE 90% - 100%</div>
            <div style={{ backgroundColor: 'yellow', padding: '5px', border: '1px solid black', marginTop: '5px', width: '100%', borderRadius: '5px', textAlign: 'center', color: 'black', fontWeight: 'bold' }}>EN ALERTA 75% - 89%</div>
            <div style={{ backgroundColor: 'red', padding: '5px', border: '1px solid black', marginTop: '5px', width: '100%', borderRadius: '5px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>CRITICO 0% - 74%</div>
          </div>
          <p className="TableDetailsDD-general-average" style={{ backgroundColor, color: textColor }} >Promedio General : <strong>{finalAverage}%</strong></p>
        </div>
      </div>

      <div className="BPMDetailsSummary-graph">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { width: '100%', height: '100%' } }}
        />
      </div>

      <table className="BPMDetailsSummary-table">
        <thead>
          <tr>
            <th>Modulo</th>
            <th>Nombre</th>
            <th>Ponderacion</th>
            <th>Promedio</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((group) => (
            <tr key={group.groupName}>
              <td>{group.groupName}</td>
              <td>{group.nombreCompleto}</td>
              <td>{group.percentage}%</td>
              <td>{group.average}%</td>
              <td>{((parseFloat(group.average) * group.percentage) / 100).toFixed(1)}%</td>
            </tr>
          ))}
          <tr className="bg-warning">
            <td colSpan={4}><strong>PROMEDIO FINAL PONDERADO</strong></td>
            <td>{finalAverage}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BPMDetailsSummary;
