import './IESatisfaccion.css';

const IESatisfaccion: React.FC = () => {

  return (
    <div className="ie-satisfaccion-container">
      <div className="satisfaccion-cards">
        <div className="satisfaccion-card blue">Calidad del Servicio SER 71</div>
        <div className="satisfaccion-card red">Trazabilidad del Producto RL 4</div>
        <div className="satisfaccion-card yellow">Calidad Organoleptica QQ 79</div>
        <div className="satisfaccion-card gray">Inventario de Vajilla SER 74</div>
      </div>
      <div className="satisfaccion-promedio-final">
        <p>Aquí el promedio final</p>
      </div>
    </div>
  );
}

export default IESatisfaccion;
