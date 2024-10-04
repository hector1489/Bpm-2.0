import './Average.css'
import { useContext, useMemo } from 'react'
import { AppContext } from '../../context/GlobalState'

const AverageModules: React.FC = () => {
  const { state } = useContext(AppContext) || {};

  if (!state) {
    return <div>Error: Context is not available.</div>;
  }

  const calculatePercentage = (moduleId: number): number => {
    const moduleQuestions = state.IsHero.filter(question => question.id === moduleId);
    const totalQuestions = moduleQuestions.length;

    if (totalQuestions === 0) return 100;

    const totalPercentage = moduleQuestions.reduce((acc, question) => {
      const match = typeof question.answer === 'string' ? question.answer.match(/(\d+)%/) : null;
      const percentage = match ? parseInt(match[1], 10) : 0;
      return acc + percentage;
    }, 0);

    return totalPercentage / totalQuestions;
  }

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }));

  const bpmModules = ['infraestructura', 'legales'];
  const poesModules = [
    'poes-control-productos', 'Agua', 'poes-superficies', 'contaminacion-cruzada',
    'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'
  ];
  const poeModules = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
  ];
  const maModules = ['MA'];
  const docModules = ['doc'];
  const lumModules = ['poes-superficies'];
  const traModules = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
  ];

  const calcularPromedioGrupo = (modulos: string[]) => {
    const modulosDelGrupo = moduleData.filter((mod) => modulos.includes(mod.moduleName));
    const total = modulosDelGrupo.reduce((acc, curr) => acc + (curr.percentage ?? 100), 0);
    return modulosDelGrupo.length > 0 ? total / modulosDelGrupo.length : 100;
  };

  const groupedData = [
    { groupName: 'BPM', aspectsEvaluated: 'INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES', weighing: '4%', average: calcularPromedioGrupo(bpmModules).toFixed(2) },
    { groupName: 'POES', aspectsEvaluated: 'PROCEDIMIENTOS OP. DE SANITIZACION', weighing: '25%', average: calcularPromedioGrupo(poesModules).toFixed(2) },
    { groupName: 'POE', aspectsEvaluated: 'PROCEDIMIENTOS OP. DEL PROCESO', weighing: '25%', average: calcularPromedioGrupo(poeModules).toFixed(2) },
    { groupName: 'MA', aspectsEvaluated: 'MANEJO AMBIENTAL', weighing: '4%', average: calcularPromedioGrupo(maModules).toFixed(2) },
    { groupName: 'DOC', aspectsEvaluated: 'DOCUMENTACION', weighing: '10%', average: calcularPromedioGrupo(docModules).toFixed(2) },
    { groupName: 'LUM', aspectsEvaluated: 'TRAZADORES DE POSIBLE BROTE ETA', weighing: '21%', average: calcularPromedioGrupo(lumModules).toFixed(2) },
    { groupName: 'TRA', aspectsEvaluated: 'LUMINOMETRIA', weighing: '10%', average: calcularPromedioGrupo(traModules).toFixed(2) },
  ];

  const finalAverage = useMemo(() => {
    const totalPercentage = state.modules.reduce((acc, module) => acc + calculatePercentage(module.id), 0);
    return (totalPercentage / state.modules.length).toFixed(2);
  }, [state.modules])

  return (
    <div className="audit-summary">
      <div className="table-responsive">
        <table id="tabla-auditoria" className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>N°</th>
              <th>MODULO</th>
              <th>ASPECTOS EVALUADOS</th>
              <th>PONDERACIÓN (%)</th>
              <th>PORCENTAJE (%)</th>
            </tr>
          </thead>
          <tbody id="audit-table-body">
            {groupedData.map((group, index) => (
              <tr key={group.groupName} className="group-row">
                <td>{state.modules.length + index + 1}</td>
                <td>{group.groupName}</td>
                <td>{group.aspectsEvaluated}</td>
                <td>{group.weighing}</td>
                <td>{group.average}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot className='bg-warning'>
            <tr>
              <td colSpan={4}>PROMEDIO FINAL PONDERADO</td>
              <td>{finalAverage}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default AverageModules;
