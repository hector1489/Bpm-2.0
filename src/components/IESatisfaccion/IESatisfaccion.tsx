import './IESatisfaccion.css';

const IESatisfaccion: React.FC = () => {

  return (
    <div className="ie-satisfaccion-container">
      <div className="satisfaccion-cards">
        <div className="satisfaccion-card blue">
          <i className="fa-regular fa-user"></i>
          <p>Calidad del Servicio SER 71</p>
          <p> %</p>
        </div>

        <div className="satisfaccion-card red">
          <i className="fa-regular fa-user"></i>
          <p>Trazabilidad del Producto RL 4</p>
          <p> %</p>
        </div>

        <div className="satisfaccion-card yellow">
          <i className="fa-regular fa-user"></i>
          <p>Calidad Organoleptica QQ 79</p>
          <p> %</p>
        </div>

        <div className="satisfaccion-card gray">
          <i className="fa-solid fa-check"></i>
          <p>Inventario de Vajilla SER 74</p>
          <p> %</p>
        </div>

      </div>
      <div className="satisfaccion-promedio-final">

        <p>Aquí el promedio final : </p>
      </div>
    </div>
  );
}

export default IESatisfaccion;
