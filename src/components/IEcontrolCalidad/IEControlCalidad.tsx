import './IEControlCalidad.css';

interface TablaDetail {
  field3: string;
  field4: string;
}

interface IEControlCalidadProps {
  tablaDetails: TablaDetail[];
}

const extractPrefix = (field3: string) => {
  const match = field3.match(/^TRA [A-Z]+ \d+/);
  return match ? match[0] : '';
};

const extractPercentage = (field4: string) => {
  const match = field4.match(/^(\d+)%/);
  return match ? match[1] : '0';
};

const IEControlCalidad: React.FC<IEControlCalidadProps> = ({ tablaDetails }) => {
  const controlPoints = [
    'REC 39. Verificar registro recepción materias primas, inventario, ordenes de compra y guías de despacho (Art. 61, 69)',
    'PPT 87. Los productos se etiquetan de acuerdo a las exigencias reglamentarias. (Art. 107 al 121)',
    'PPT 86. Para envasar los productos se utilizan materiales adecuados, los cuales son mantenidos en condiciones que eviten su contaminación. (Art. 11, 123)',
    'ALM 47. Cumplimiento del sistema FIFO o FEFO, según corresponda',
    'REC 42. Las materias primas utilizadas provienen de establecimientos autorizados y debidamente rotuladas y/o identificadas. (Art. 61, 96)',
    'ALM 45. Identificación de áreas y estantes, por familias de productos',
    'CC 22. Separación de utensilios por área, y separación alimentos (cocido - crudo - sucio, otros)',
    'ELB 58. Orden, limpieza y T° correcta en todos los equipos de frío. Termómetro interno'
  ];

  // Mapear los puntos de control con los detalles y porcentajes de `tablaDetails`
  const updatedControlPoints = controlPoints.map((point) => {
    const prefix = extractPrefix(point);
    const found = tablaDetails.find((detail) => extractPrefix(detail.field3) === prefix);
    const percentage = found?.field4 === 'N/A' ? 'N/A' : `${extractPercentage(found?.field4 || '0')}`;

    return {
      text: point,
      percentage
    };
  });

  const calculateAverage = () => {
    const percentages = updatedControlPoints
      .map(point => parseInt(point.percentage))
      .filter(p => !isNaN(p));
    const total = percentages.reduce((acc, value) => acc + value, 0);
    return percentages.length > 0 ? (total / percentages.length).toFixed(2) : 'N/A';
  };

  return (
    <div className="ie-control-container">
      <div className="container-linea">
        <div className="control-linea">
          {updatedControlPoints.map((point, index) => (
            <div key={index} className={`control-punto ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="percentage-circle">{point.percentage === 'N/A' ? 'N/A' : `${point.percentage}%`}</div>
              <div className="point-text">
                {point.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="control-promedio-final">
        <p>Promedio Total: {calculateAverage()}%</p>
      </div>
    </div>
  );
};

export default IEControlCalidad;



