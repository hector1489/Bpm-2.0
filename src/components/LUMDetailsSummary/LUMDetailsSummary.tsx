import './LUMDetailsSummary.css'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcharts3D from 'highcharts/highcharts-3d'
import { AppContext } from '../../context/GlobalState'
import { getColorByPercentage } from '../../utils/utils'
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails'
import { useContext, useEffect, useState } from 'react'

Highcharts3D(Highcharts);

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface LUMDetailsSummaryProps {
  numeroAuditoria: string | null;
}

const LUMDetailsSummary: React.FC<LUMDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error: Context no está disponible.</div>;
  }

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

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const lumQuestion = ['LUM 21. Toma de muestra y uso de luminómetro:'];

  const matchedDetails = tablaDetails.filter(detail =>
    lumQuestion.includes(detail.field3)
  );

  const questionNames = matchedDetails.map(detail => detail.field3);
  const percentages = matchedDetails.map(detail => parseFloat(detail.field4.replace('%', '')) || 0);
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
