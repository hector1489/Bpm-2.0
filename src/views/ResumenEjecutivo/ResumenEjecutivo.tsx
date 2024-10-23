import { BPMGraph, ETAGraph, KPIGraph, LUMGraph } from '../../components';
import './ResumenEjecutivo.css';
import { useNavigate, useLocation } from 'react-router-dom';

interface Module {
  id: number;
  module: string;
}

function createModuleData(module: Module): { moduleName: string; percentage: number } {
  return {
    moduleName: module.module,
    percentage: Math.floor(Math.random() * 101),
  };
}

function createKPIModuleData(module: Module): { moduleName: string; question: string; answer: string; percentage: number | null } {
  return {
    moduleName: module.module,
    question: `Pregunta para ${module.module}`,
    answer: `Respuesta para ${module.module}`,
    percentage: Math.random() > 0.5 ? Math.floor(Math.random() * 101) : null,
  };
}

function createETAModuleData(module: Module): { moduleName: string; percentage: number } {
  return {
    moduleName: module.module,
    percentage: Math.floor(Math.random() * 101),
  };
}

const ResumenEjecutivo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, numero_requerimiento } = location.state || {};

  const modules: Module[] = [
    { id: 1, module: 'Módulo 1' },
    { id: 2, module: 'Módulo 2' },
    { id: 3, module: 'Módulo 3' },
    { id: 4, module: 'Módulo 4' },
  ];

  const moduleData = modules.map(createModuleData);
  const kpiModuleData = modules.map(createKPIModuleData);
  const etaModuleData = modules.map(createETAModuleData);

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="ResumenEjecutivo-container">
      <p>Resumen Ejecutivo</p>
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}
      <div id="kpi-graph">
        <KPIGraph moduleData={kpiModuleData} />
      </div>
      <div id="bpm-graph">
        <BPMGraph moduleData={moduleData} />
      </div>
      <div id="lum-graph">
        <LUMGraph/>
      </div>
      <div id="eta-graph">
        <ETAGraph moduleData={etaModuleData}  />
      </div>
      <button onClick={handleGoDoc}>Volver</button>
    </div>
  );
};

export default ResumenEjecutivo;
