import './LUMDetailsSummary.css'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcharts3D from 'highcharts/highcharts-3d'
import { AppContext } from '../../context/GlobalState'
import { getColorByPercentage } from '../../utils/utils'
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails'
import { useContext, useEffect, useState } from 'react'
import { getAuditSheetByUsername } from '../../utils/apiAuditSheet';

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


if (typeof Highcharts === 'object') {
  Highcharts3D(Highcharts);
}


const LUMDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  if (!context) {
    return <div>Error: Context no está disponible.</div>;
  }

  const { state } = context;

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria || tablaDetails.length > 0) return;  // Verificar si ya hay datos

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
  }, [numeroAuditoria, tablaDetails.length]);


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

  // useEffect para filtrar los datos por numero de auditoría
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


  const lumQuestion = ['LUM 21. Toma de muestra y uso de luminómetro:'];

  const matchedDetails = tablaDetails.filter(detail =>
    lumQuestion.includes(detail.field3)
  );

  const uniqueMatchedDetails = matchedDetails.filter(
    (detail, index, self) =>
      index === self.findIndex((d) => d.field3 === detail.field3)
  );

  const questionNames = uniqueMatchedDetails.map(detail => detail.field3);
  const percentages = uniqueMatchedDetails.map(detail => parseFloat(detail.field4.replace('%', '')) || 100);
  const barColors = percentages.map(getColorByPercentage);

  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70,
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: questionNames,
      title: {
        text: '',
      },
    },
    yAxis: {
      title: {
        text: 'Porcentaje (%)',
      },
      max: 100,
    },
    series: [
      {
        name: 'Porcentaje',
        data: percentages,
        colorByPoint: true,
        colors: barColors,
        dataLabels: {
          enabled: true,
          format: '{y}%',
          style: {
            fontWeight: 'bold',
            color: 'black',
          },
        },
      },
    ],
    plotOptions: {
      column: {
        depth: 25,
        dataLabels: {
          enabled: true,
        },
      },
    },
  };


  return (
    <div className="LUMDetailsSummary-container">
      <p>LUMDetailsSummary</p>
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

        </div>

      </div>


      <HighchartsReact highcharts={Highcharts} options={chartOptions} />


      <div className="table-responsive">
        <table id="luminometry-table" className="table table-bordered text-center table-sm" style={{ fontSize: '12px' }}>
          <thead className="table-light">
            <tr>
              <th>URL</th>
              <th>MEDICIÓN DE EQUIPO</th>
              <th>PORCENTAJE</th>
              <th>NOTA</th>
              <th>EVALUACIÓN</th>
              <th>GRADO DE LIMPIEZA</th>
              <th>CLASIFICACIÓN DEL RIESGO</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">0-50</td>
              <td data-label="MEDICIÓN DE EQUIPO">I ≤ 2.2</td>
              <td data-label="PORCENTAJE">100%</td>
              <td data-label="NOTA">7</td>
              <td data-label="EVALUACIÓN">EXCELENTE</td>
              <td data-label="GRADO DE LIMPIEZA">MUY LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">51-150</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.3</td>
              <td data-label="PORCENTAJE">83%</td>
              <td data-label="NOTA">6</td>
              <td data-label="EVALUACIÓN">MUY BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">51-150</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.4</td>
              <td data-label="PORCENTAJE">83%</td>
              <td data-label="NOTA">6</td>
              <td data-label="EVALUACIÓN">MUY BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td data-label="URL">51-150</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.5</td>
              <td data-label="PORCENTAJE">83%</td>
              <td data-label="NOTA">6</td>
              <td data-label="EVALUACIÓN">MUY BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">LIMPIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">SIN RIESGO</td>
            </tr>

            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">151-250</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.6</td>
              <td data-label="PORCENTAJE">69%</td>
              <td data-label="NOTA">5</td>
              <td data-label="EVALUACIÓN">BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">MEDIANAMENTE SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">BAJO RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">151-250</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.7</td>
              <td data-label="PORCENTAJE">69%</td>
              <td data-label="NOTA">5</td>
              <td data-label="EVALUACIÓN">BUENO</td>
              <td data-label="GRADO DE LIMPIEZA">MEDIANAMENTE SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">BAJO RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">251-500</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.8</td>
              <td data-label="PORCENTAJE">55%</td>
              <td data-label="NOTA">4</td>
              <td data-label="EVALUACIÓN">REGULAR</td>
              <td data-label="GRADO DE LIMPIEZA">ALERTA</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">RIESGO (LEVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td data-label="URL">251-500</td>
              <td data-label="MEDICIÓN DE EQUIPO">2.9</td>
              <td data-label="PORCENTAJE">55%</td>
              <td data-label="NOTA">4</td>
              <td data-label="EVALUACIÓN">REGULAR</td>
              <td data-label="GRADO DE LIMPIEZA">ALERTA</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">RIESGO (LEVE)</td>
            </tr>

            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td data-label="URL">501-1000</td>
              <td data-label="MEDICIÓN DE EQUIPO">3 ≤ l ≤ 4</td>
              <td data-label="PORCENTAJE">42%</td>
              <td data-label="NOTA">3</td>
              <td data-label="EVALUACIÓN">DEFICIENTE</td>
              <td data-label="GRADO DE LIMPIEZA">SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">MEDIANO RIESGO (GRAVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td data-label="URL">1001-5000</td>
              <td data-label="MEDICIÓN DE EQUIPO">4.1 ≤ l ≤ 4.9</td>
              <td data-label="PORCENTAJE">28%</td>
              <td data-label="NOTA">2</td>
              <td data-label="EVALUACIÓN">MALA</td>
              <td data-label="GRADO DE LIMPIEZA">MUY SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">ALTO RIESGO (MUY GRAVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td data-label="URL">5001-10000</td>
              <td data-label="MEDICIÓN DE EQUIPO">5 ≤ l</td>
              <td data-label="PORCENTAJE">14%</td>
              <td data-label="NOTA">1</td>
              <td data-label="EVALUACIÓN">MUY MALA</td>
              <td data-label="GRADO DE LIMPIEZA">TOTALMENTE SUCIO</td>
              <td data-label="CLASIFICACIÓN DEL RIESGO">MUY ALTO RIESGO (CRÍTICO)</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default LUMDetailsSummary;
