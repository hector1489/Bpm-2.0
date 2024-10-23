import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import './IESatisfaccion.css';

interface TablaDetail {
  field3: string;
  field4: string;
}

interface SatisfaccionCard {
  iconClass: string;
  text: string;
  percentage: string;
  colorClass: string;
}

interface IESatisfaccionProps {
  tablaDetails: TablaDetail[];
}

Highcharts3D(Highcharts);

const extractPrefix = (field3: string) => {
  const match = field3.match(/^TRA [A-Z]+ \d+/);
  return match ? match[0] : '';
};

const extractPercentage = (field4: string) => {
  const match = field4.match(/^(\d+)%/);
  return match ? match[1] : '';
};

const IESatisfaccion: React.FC<IESatisfaccionProps> = ({ tablaDetails }) => {
  const cardsData: SatisfaccionCard[] = [
    {
      iconClass: 'fa-regular fa-user',
      text: 'SER 71. Variedad de alternativas instaladas en línea autoservicio, según menú:',
      percentage: '%',
      colorClass: 'blue'
    },
    {
      iconClass: 'fa-regular fa-user',
      text: 'RL 4. Es factible realizar trazabilidad de producto:',
      percentage: '%',
      colorClass: 'red'
    },
    {
      iconClass: 'fa-regular fa-user',
      text: 'QQ 79. Verificar monitoreo de controles de proceso y verificación por la supervisión:',
      percentage: '%',
      colorClass: 'yellow'
    },
    {
      iconClass: 'fa-solid fa-check',
      text: 'SER 74. Vajilla, bandejas y cubiertos en cantidad correcta, limpios y secos:',
      percentage: '%',
      colorClass: 'gray'
    }
  ];

  const updatedCardsData = cardsData.map(card => {
    const prefix = extractPrefix(card.text);
    const found = tablaDetails.find(detail => extractPrefix(detail.field3) === prefix);
    return {
      ...card,
      percentage: found ? `${extractPercentage(found.field4)}%` : '%' 
    };
  });

  const calculateAverage = () => {
    const percentages = updatedCardsData
      .map(card => parseInt(card.percentage))
      .filter(value => !isNaN(value));
    const total = percentages.reduce((acc, value) => acc + value, 0);
    const average = percentages.length > 0 ? total / percentages.length : 0;
    return average.toFixed(2);
  };

  // Definir colores basados en las clases de color de las tarjetas
  const colors = ['#1E90FF', '#FF4500', '#FFD700', '#808080']; // azul, rojo, amarillo, gris

  const chartOptions = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      }
    },
    title: {
      text: 'Porcentajes de Satisfacción'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}%'
        }
      }
    },
    series: [{
      name: 'Satisfacción',
      colors, // Asignar los colores definidos
      data: updatedCardsData
        .map((card, index) => ({
          name: card.text,
          y: parseInt(card.percentage),
          color: colors[index] // Asignar el color de acuerdo con el índice de la tarjeta
        }))
        .filter(point => !isNaN(point.y))
    }]
  };

  return (
    <div className="ie-satisfaccion-container">
      <div className="satisfaccion-cards">
        {updatedCardsData.map((card, index) => (
          <div key={index} className={`satisfaccion-card ${card.colorClass}`}>
            <i className={card.iconClass}></i>
            <p>{card.text}</p>
            <p>{card.percentage}</p>
          </div>
        ))}
      </div>
      <div className="satisfaccion-pie-chart">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <div className="satisfaccion-promedio-final">
        <p>Promedio: {calculateAverage()}%</p>
      </div>
    </div>
  );
};

export default IESatisfaccion;
