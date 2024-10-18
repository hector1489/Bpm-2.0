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

  const renderSatisfaccionCards = () => {
    return updatedCardsData.map((card, index) => (
      <div key={index} className={`satisfaccion-card ${card.colorClass}`}>
        <i className={card.iconClass}></i>
        <p>{card.text}</p>
        <p>{card.percentage}</p>
      </div>
    ));
  };

  return (
    <div className="ie-satisfaccion-container">
      <div className="satisfaccion-cards">
        {renderSatisfaccionCards()}
      </div>
      <div className="satisfaccion-promedio-final">
        <p>Promedio: {calculateAverage()}%</p>
      </div>
    </div>
  );
};

export default IESatisfaccion;
