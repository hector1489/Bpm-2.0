import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IECriticalFindings.css';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IECriticalFindingsProps {
  detallesFiltrados: TablaDetail[];
}

const IECriticalFindings: React.FC<IECriticalFindingsProps> = ({ detallesFiltrados }) => {
   // Función para obtener las opciones de Highcharts
   const getOptions = (porcentaje: number | string) => {
    if (porcentaje === 'NA') {
      return {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          height: 120,
          width: 120,
        },
        title: {
          text: '',
        },
        plotOptions: {
          pie: {
            innerSize: '70%',
            borderColor: null,
            dataLabels: {
              enabled: true,
              distance: -30,
              style: {
                color: '#000000',
                fontSize: '12px',
                fontWeight: 'bold',
                textOutline: 'none',
              },
              formatter: function () {
                return `NA`;
              },
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        series: [
          {
            data: [
              { y: 100, color: '#e0e0e0' },
            ],
          },
        ],
      };
    }

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 120,
        width: 120,
      },
      title: {
        text: '',
      },
      plotOptions: {
        pie: {
          innerSize: '70%',
          borderColor: null,
          dataLabels: {
            enabled: true,
            distance: -30,
            style: {
              color: '#000000',
              fontSize: '12px',
              fontWeight: 'bold',
              textOutline: 'none',
            },
            formatter: function () {
              return `${porcentaje}%`;
            },
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      series: [
        {
          data: [
            { y: porcentaje as number, color: '#007bff' },
            { y: 100 - (porcentaje as number), color: '#e0e0e0' },
          ],
        },
      ],
    };
  };

  // Calcular el promedio total de los porcentajes, ignorando los "NA"
  const totalPorcentaje = detallesFiltrados.reduce((sum, detalle) => {
    const porcentaje = isNaN(parseInt(detalle.field4)) ? 0 : parseInt(detalle.field4);
    return sum + porcentaje;
  }, 0);

  const validDetalles = detallesFiltrados.filter(detalle => !isNaN(parseInt(detalle.field4)));
  const promedioPorcentaje = (validDetalles.length > 0)
    ? (totalPorcentaje / validDetalles.length).toFixed(2)
    : '0';

  return (
     <div className="IECriticalFinding">
      <div className="IECriticalFinding-container">
        {detallesFiltrados.length === 0 ? (
          <p className="no-findings-message">No se encontraron hallazgos críticos</p>
        ) : (
          detallesFiltrados.map((detalle, index) => {
            const porcentaje = isNaN(parseInt(detalle.field4)) ? 'NA' : parseInt(detalle.field4);

            return (
              <div key={index} className="critical-card">
                <div className="circular-bar">
                  <div className="doughnut-chart">
                    <HighchartsReact highcharts={Highcharts} options={getOptions(porcentaje)} />
                  </div>
                  <div className="critical-text">
                    <p>{detalle.field1} - {porcentaje === 'NA' ? 'NA' : `${porcentaje}%`}</p>
                  </div>
                </div>

                <div className="percentage-bars">
                  <div className="bar green" style={{ width: `${porcentaje !== 'NA' ? porcentaje : 0}%` }}>
                    <span className="question">{detalle.field3}</span>
                  </div>
                  <div className="bar yellow" style={{ width: `${porcentaje !== 'NA' ? porcentaje : 0}%` }}>
                    <span className="percentage">{porcentaje !== 'NA' ? `${porcentaje}%` : 'NA'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {detallesFiltrados.length > 0 && (
        <div className="average-title">
          <p>Promedio Total: {promedioPorcentaje}%</p>
        </div>
      )}
    </div>
  );
}

export default IECriticalFindings;
