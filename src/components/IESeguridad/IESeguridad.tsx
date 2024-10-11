import './IESeguridad.css';

const IESeguridad: React.FC = () => {

  return (
    <div className="ie-seguridad-container">
      <div className="seguridad-cards">
        <div className="seguridad-card black">Control de Plagas CP 34</div>
        <div className="seguridad-card green">Controles de Procesos RL 5</div>
        <div className="seguridad-card red">CReclamo a Proveedores REC 72</div>
        <div className="seguridad-card yellow">No Conformidades Internas ALM 48</div>
        <div className="seguridad-card blue">Control Uso de Químicos CQ 10</div>
        <div className="seguridad-card gray">Toma Contramuestras QQ 81</div>
      </div>
    </div>
  );
}

export default IESeguridad;
