import './IEIndicadores.css';

const IEIndicadoresClave: React.FC = () => {

  return (
    <div className="ie-indicadores-container">
      <div className="indicadores-head">
        <div className="indicadores-bars">
          <div className="indicador-bar black"></div>
          <div className="indicador-bar green"></div>
          <div className="indicador-bar red"></div>
          <div className="indicador-bar yellow"></div>
          <div className="indicador-bar blue"></div>
        </div>
        <div className="indicadores-icons">
          <div className="indicador-icon">BPM</div>
          <div className="indicador-icon">MINUTA</div>
          <div className="indicador-icon">EXÁMENES</div>
          <div className="indicador-icon">INAPTITUD MICROBIOLÓGICA</div>
          <div className="indicador-icon">CAPACITACIONES</div>
        </div>
      </div>
      <div className="indicadores-footer">
        <div className="indicadores-circular">
          <div className="circular graph black">Negro</div>
          <div className="circular graph green">Verde</div>
          <div className="circular graph red">Rojo</div>
          <div className="circular graph yellow">Amarillo</div>
          <div className="circular graph blue">Azul</div>
        </div>
      </div>
    </div>
  );
}

export default IEIndicadoresClave;
