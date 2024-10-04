import './AverageTable.css';
import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';

const AverageTable: React.FC = () => {
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
  };

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
    { groupName: 'BPM', average: calcularPromedioGrupo(bpmModules).toFixed(2) },
    { groupName: 'POES', average: calcularPromedioGrupo(poesModules).toFixed(2) },
    { groupName: 'POE', average: calcularPromedioGrupo(poeModules).toFixed(2) },
    { groupName: 'MA', average: calcularPromedioGrupo(maModules).toFixed(2) },
    { groupName: 'DOC', average: calcularPromedioGrupo(docModules).toFixed(2) },
    { groupName: 'LUM', average: calcularPromedioGrupo(lumModules).toFixed(2) },
    { groupName: 'TRA', average: calcularPromedioGrupo(traModules).toFixed(2) },
  ];

  const finalAverage = useMemo(() => {
    const totalPercentage = state.modules.reduce((acc, module) => acc + calculatePercentage(module.id), 0);
    return (totalPercentage / state.modules.length).toFixed(2);
  }, [state.modules]);

  return (
    <div className="average-table">
      <div className="table-responsive">
        <table id="tabla-average" className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>MODULO</th>
              <th>PORCENTAJE (%)</th>
            </tr>
          </thead>
          <tbody id="average-table-body">
            {groupedData.map((group) => (
              <tr key={group.groupName} className="group-row">
                <td>{group.groupName}</td>
                <td>{group.average}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot >
            <tr className='bg-warning'>
              <td>PROMEDIO FINAL PONDERADO</td>
              <td>{finalAverage}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AverageTable;
