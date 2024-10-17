import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IECriticalEvaluation.css';

Highcharts3D(Highcharts);

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface IECriticalEvaluationProps {
  detallesFiltrados: TablaDetail[];
}

const getShortTitle = (field3: string) => {
  const match = field3.match(/^.*?\./);
  return match ? match[0] : field3;
};

const IECriticalEvaluation: React.FC<IECriticalEvaluationProps> = ({ detallesFiltrados }) => {
  
  const detallesInferioresA50 = detallesFiltrados.filter((detalle) => parseInt(detalle.field4) < 51);

  const renderChartOptions = (percentage: number, title: string) => {
    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 200,
        width: 200,
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        text: title,
      },
      plotOptions: {
        pie: {
          innerSize: '40%',
          depth: 30,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
        },
      },
      series: [
        {
          name: 'Evaluación Crítica',
          colorByPoint: true,
          data: [
            { name: 'Infraestructura', y: percentage, color: '#28a745' },
            { name: 'Equipamiento', y: percentage, color: '#dc3545' },
            { name: 'Utensilios', y: percentage, color: '#ffc107' },
            { name: 'Higiene Manipulador', y: percentage, color: '#6c757d' },
            { name: 'Uniforme Completo', y: percentage, color: '#343a40' },
          ],
        },
      ],
    };
  };

  return (
    <div className="criticalEvaluation-container">
      {detallesInferioresA50.map((detalle, index) => (
        <div key={index} className="card-evaluation-container">
          <div className="circular-graph-evaluation">
            <HighchartsReact highcharts={Highcharts} options={renderChartOptions(parseInt(detalle.field4), getShortTitle(detalle.field3))} />
          </div>
          <div className="cards-evaluation">
            <div className="card-evaluation green">Infraestructura</div>
            <div className="card-evaluation red">Equipamiento</div>
            <div className="card-evaluation yellow">Utensilios</div>
            <div className="card-evaluation gray">Higiene Manipulador</div>
            <div className="card-evaluation black">Uniforme Completo</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IECriticalEvaluation;
