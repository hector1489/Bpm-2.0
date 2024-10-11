import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './IEHigiene.css';

const IEHigiene: React.FC = () => {

  const options = {
    chart: {
      polar: true,
      type: 'area',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Evaluación de Higiene'
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      size: '80%'
    },
    xAxis: {
      categories: ['LUMINOMETRIA LUM 21', 'LIMPIEZA EQUIPOS CS 13', 'LIMPIEZA UTENSILIOS CS 12', 'SANITIZACION GRAL PRE 56'],
      tickmarkPlacement: 'on',
      lineWidth: 0
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      max: 100,
      tickInterval: 20,
      title: {
        text: '% de cumplimiento'
      }
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}%</b><br/>'
    },
    series: [{
      name: 'Cumplimiento',
      data: [80, 60, 70, 90],
      pointPlacement: 'on',
      color: '#000',
      zones: [
        {
          value: 80,
          color: 'red' 
        },
        {
          value: 60,
          color: 'yellow' 
        },
        {
          value: 70,
          color: 'blue' 
        },
        {
          value: 90,
          color: 'green'
        }
      ]
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="ie-higiene-container">

      <div className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>

      <div className="cards-higiene-ie">
        <div className="card-higiene red">
          <p>LUMINOMETRIA LUM 21</p>
          <p>80%</p>
        </div>
        <div className="card-higiene yellow">
          <p>LIMPIEZA EQUIPOS CS 13</p>
          <p>60%</p>
        </div>
        <div className="card-higiene blue">
          <p>LIMPIEZA UTENSILIOS CS 12</p>
          <p>70%</p>
        </div>
        <div className="card-higiene green">
          <p>SANITIZACION GRAL PRE 56</p>
          <p>90%</p>
        </div>
      </div>

    </div>
  );
}

export default IEHigiene;
