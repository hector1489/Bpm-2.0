import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IEEficienciaOp.css';

const IEEficienciaOp: React.FC = () => {

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
    },
    title: {
      text: '', // Sin título
    },
    xAxis: {
      categories: [
        'Flujo Operaciones',
        'Procedimientos',
        'Resoluciones',
        'Mantenciones',
        'Almacenamiento',
        'Control Temp.',
        'Planificación',
        'Reposición'
      ],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Porcentaje'
      },
    },
    series: [
      {
        name: 'Eficiencia',
        data: [82, 83, 95, 6, 8, 41, 51, 73], // Ejemplo de valores para cada categoría
        colorByPoint: true, // Permite que cada barra tenga su propio color
        colors: [
          '#1E90FF', '#32CD32', '#FF4500', '#FFD700', '#8A2BE2', '#FF69B4', '#20B2AA', '#FF6347'
        ], // Colores correspondientes
      }
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{y}%', // Muestra los porcentajes en las barras
        }
      }
    }
  };

  return (
    <div className="ie-eficiencia-container">

      {/* Reemplazamos las barras estáticas con el gráfico de Highcharts */}
      <div className="ie-eficiencia-grafico">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      <div className="ie-eficiencia-cards">
        <div className="eficiencia-card flujo-op">Flujo Operaciones PPT 82</div>
        <div className="eficiencia-card procedimientos">Procedimientos Estandarizados PPT 83</div>
        <div className="eficiencia-card resoluciones">Cumplimiento Resoluciones Sanitarias DOC 95</div>
        <div className="eficiencia-card mantenciones">Mantenciones Correctivas RL 6</div>
        <div className="eficiencia-card almacenamiento">Almacenamiento de Productos Químicos SQA 8</div>
        <div className="eficiencia-card control-temperatura">Control Tiempo de Temperatura REC 41</div>
        <div className="eficiencia-card planificacion">Planificación de Productos ALM 51</div>
        <div className="eficiencia-card reposicion">Reposición SER 73</div>
      </div>

    </div>
  );
}

export default IEEficienciaOp;
