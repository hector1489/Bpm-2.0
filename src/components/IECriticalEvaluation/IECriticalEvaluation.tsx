import './IECriticalEvaluation.css';

const IECriticalEvaluation: React.FC = () => {

  return (
    <div className="criticalEvaluation-container">
      <div className="card-evaluation-container">
        <div className="circular-graph-evaluation">
          <div className="circle-evaluation">5 Opciones</div>
          <p>Gráfico circular con 5 opciones</p>
        </div>
        <div className="cards-evaluation">
          <div className="card-evaluation green">Infraestructura</div>
          <div className="card-evaluation red">Equipamiento</div>
          <div className="card-evaluation yellow">Utensilios</div>
          <div className="card-evaluation gray">Higiene Manipulador</div>
          <div className="card-evaluation gray">Uniforme Completo</div>
        </div>
      </div>
    </div>
  );
}

export default IECriticalEvaluation;
