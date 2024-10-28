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
  const lumModules = ['LUM 21. Toma de muestra y uso de luminómetro:'];
  const traModules = [
    'poes-higiene-empleados', 'poe-preelaboraciones', 'poe-elaboracion',
    'poe-mantencion', 'poe-transporte', 'poe-servicio', 'doc'
  ];

  const calcularPromedioGrupo = (modulos: string[]) => {
    const modulosDelGrupo = moduleData.filter((mod) => modulos.includes(mod.moduleName));
    const total = modulosDelGrupo.reduce((acc, curr) => acc + (curr.percentage ?? 100), 0);
    return modulosDelGrupo.length > 0 ? total / modulosDelGrupo.length : 100;
  };

  const ponderaciones = {
    BPM: 4,
    POES: 25,
    POE: 25,
    MA: 4,
    DOC: 10,
    TRA: 10,
    LUM: 21,
  };

  const groupedData = [
    { groupName: 'BPM', average: calcularPromedioGrupo(bpmModules).toFixed(2), weighing: ponderaciones.BPM },
    { groupName: 'POES', average: calcularPromedioGrupo(poesModules).toFixed(2), weighing: ponderaciones.POES },
    { groupName: 'POE', average: calcularPromedioGrupo(poeModules).toFixed(2), weighing: ponderaciones.POE },
    { groupName: 'MA', average: calcularPromedioGrupo(maModules).toFixed(2), weighing: ponderaciones.MA },
    { groupName: 'DOC', average: calcularPromedioGrupo(docModules).toFixed(2), weighing: ponderaciones.DOC },
    { groupName: 'TRA', average: calcularPromedioGrupo(traModules).toFixed(2), weighing: ponderaciones.TRA },
    { groupName: 'LUM', average: calcularPromedioGrupo(lumModules).toFixed(2), weighing: ponderaciones.LUM },
  ];

  const finalAverage = useMemo(() => {
    const totalWeighing = Object.values(ponderaciones).reduce((acc, peso) => acc + peso, 0);
    const weightedSum = groupedData.reduce(
      (acc, group) => acc + (parseFloat(group.average) * group.weighing) / totalWeighing,
      0
    );

    return weightedSum.toFixed(2);
  }, [groupedData]);

  const getRowClass = (average: number) => {
    if (average >= 90) return 'bg-success-light';
    if (average >= 75) return 'bg-warning-light';
    if (average >= 50) return 'bg-info-light';
    return 'bg-danger-light';
  };

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
              <tr key={group.groupName} className={getRowClass(parseFloat(group.average))}>
                <td data-label="MODULO">{group.groupName}</td>
                <td data-label="PORCENTAJE (%)">{group.average}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot id="tfood-average-table">
            <tr className="bg-warning">
              <td data-label="PROMEDIO FINAL PONDERADO">PROMEDIO FINAL PONDERADO</td>
              <td data-label="PORCENTAJE (%)">{finalAverage}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AverageTable;
