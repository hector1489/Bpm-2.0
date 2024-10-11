import React from 'react';import './IEEficienciaOp.css';

const IEEficienciaOp: React.FC = () => {

  return (
    <div className="ie-eficiencia-container">

      <div className="ie-eficiencia-grafico">
        <div className="eficiencia-bar flujo-op"></div>
        <div className="eficiencia-bar procedimientos"></div>
        <div className="eficiencia-bar resoluciones"></div>
        <div className="eficiencia-bar mantenciones"></div>
        <div className="eficiencia-bar almacenamiento"></div>
        <div className="eficiencia-bar control-temperatura"></div>
        <div className="eficiencia-bar planificacion"></div>
        <div className="eficiencia-bar reposicion"></div>
      </div>

      <div className="ie-eficiencia-cards">
        <div className="eficiencia-card flujo-op">Flujo Operaciones PPT 82</div>
        <div className="eficiencia-card procedimientos">Procedimientos Estandarizados PPT 83</div>
        <div className="eficiencia-card resoluciones">Cumplimiento Resoluciones Sanitarias DOC 95</div>
        <div className="eficiencia-card mantenciones">Mantenciones Correctivas RL 6</div>
        <div className="eficiencia-card almacenamiento">Almacenamiento de Productos Químicos SQA 8</div>
        <div className="eficiencia-card control-temperatura">Control Tiempo de Temperatura REC 41</div>
        <div className="eficiencia-card planificacion">Planificación de Productos ALM 51</div>
        <div className="eficiencia-card reposicion">Reposición SER 73</div>
      </div>

    </div>
  );
}

export default IEEficienciaOp;
