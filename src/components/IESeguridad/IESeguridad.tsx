import './IESeguridad.css';

const IESeguridad: React.FC = () => {

  return (
    <div className="ie-seguridad-container">
      <div className="seguridad-cards">
        <div className="seguridad-card black">
          <p>Control de Plagas CP 34</p>
          <p> %</p>
        </div>
        <div className="seguridad-card green">
          <p>Controles de Procesos RL 5</p>
          <p> %</p>
        </div>
        <div className="seguridad-card red">
          <p>Reclamo a Proveedores REC 72</p>
          <p> %</p>
        </div>
        <div className="seguridad-card yellow">
          <p>No Conformidades Internas ALM 48</p>
          <p> %</p>
        </div>
        <div className="seguridad-card blue">
          <p>Control Uso de Químicos CQ 10</p>
          <p> %</p>
        </div>
        <div className="seguridad-card gray">
          <p>Toma Contramuestras QQ 81</p>
          <p> %</p>
        </div>
      </div>
    </div>
  );
}

export default IESeguridad;
