import './IEControlCalidad.css';

const IEControlCalidad: React.FC = () => {
  return (
    <div className="ie-control-container">
      <div className="container-linea">
        <div className="control-linea">
          {controlPoints.map((point, index) => (
            <div key={index} className={`control-punto ${point.position}`}>
              {point.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const controlPoints = [
  { text: 'Inspeccion Materias Primas REC 39', position: 'left' },
  { text: 'Etiquetado Materias Primas PPT 87', position: 'right' },
  { text: 'Envasado de Productos Terminados PPT 86', position: 'left' },
  { text: 'Almacenamiento FEFO FIFO ALM 47', position: 'right' },
  { text: 'Rotulaciones Materias Primas REC 42', position: 'left' },
  { text: 'Rotaciones ALM 45', position: 'right' },
  { text: 'Contaminacion Cruzada CC 22', position: 'left' },
  { text: 'Control de Temperatura ELB 58', position: 'right' },
];

export default IEControlCalidad;
