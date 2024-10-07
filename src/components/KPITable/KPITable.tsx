import './KPITable.css';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

type KpiKeys = 'kpiInsp' | 'kpiCum' | 'kpiExam' | 'kpiInap' | 'totalKpi';

const KPITable: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const kpiDataTable: { module: string; ponderacion: string; promedioId: KpiKeys }[] = [
    { module: 'ALIMENTACION INSP. BPM', ponderacion: '25%', promedioId: 'kpiInsp' },
    { module: 'ALIMENTACION CUM. INUTAS', ponderacion: '25%', promedioId: 'kpiCum' },
    { module: 'ALIMENTACION EXAM. MANIP.', ponderacion: '25%', promedioId: 'kpiExam' },
    { module: 'ALIMENTACION INAP. MICROB.', ponderacion: '25%', promedioId: 'kpiInap' },
  ];

  const kpiDataTableQuestion = [
    { module: 'ALIMENTACION INSP. BPM', question: 'DOC 97. Informes de muestreo microbiológico/luminometría. Planes de acción, charlas al personal si corresponde:' },
    { module: 'ALIMENTACION CUM. INUTAS', question: 'SER 71. Variedad de alternativas instaladas en línea autoservicio, según menú (fondos, ensaladas y postres, otros):' },
    { module: 'ALIMENTACION EXAM. MANIP.', question: 'TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):' },
    { module: 'ALIMENTACION INAP. MICROB.', question: 'DOC 97. Informes de muestreo microbiológico/luminometría. Planes de acción, charlas al personal si corresponde:' },
  ];

  const [promedios, setPromedios] = useState<Record<KpiKeys, number>>({
    kpiInsp: 0,
    kpiCum: 0,
    kpiExam: 0,
    kpiInap: 0,
    totalKpi: 0,
  });

  useEffect(() => {
    const promediosData: Record<KpiKeys, number> = {
      kpiInsp: 0,
      kpiCum: 0,
      kpiExam: 0,
      kpiInap: 0,
      totalKpi: 0,
    };

    kpiDataTableQuestion.forEach(({ question }, index) => {
      const answer = getAnswerForQuestion(question) || '0%';
      const porcentaje = extractPercentageFromAnswer(answer);
      const key = kpiDataTable[index].promedioId;
      promediosData[key] = porcentaje;
    });

    const totalKpi = parseFloat(
      (
        (promediosData.kpiInsp +
          promediosData.kpiCum +
          promediosData.kpiExam +
          promediosData.kpiInap) /
        4
      ).toFixed(2)
    );

    setPromedios({ ...promediosData, totalKpi });
  }, [state]);

  const getAnswerForQuestion = (questionText: string) => {
    const foundQuestion = state.IsHero.find((q) => q.question === questionText);
    return foundQuestion ? foundQuestion.answer : undefined;
  };

  const extractPercentageFromAnswer = (answer: string) => {
    const percentage = parseFloat(answer.split('%')[0].trim());
    return isNaN(percentage) ? 0 : percentage;
  };

  return (
    <div className="kpi-table-container">
      <table id="kpiTable" className="table table-bordered text-center table-sm">
        <thead>
          <tr className="bg-info">
            <th>INDICADOR</th>
            <th>PONDERACION ITEM CODELCO (25%)</th>
            <th>PROMEDIO</th>
          </tr>
        </thead>
        <tbody>
          {kpiDataTable.map((row, index) => (
            <tr key={index}>
              <td>{row.module}</td>
              <td>{row.ponderacion}</td>
              <td>
                <span>{promedios[row.promedioId] ?? 0}%</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-warning">
            <td colSpan={2}>TOTAL ALIMENTACION</td>
            <td>
              <span>{promedios.totalKpi ?? 0}</span> %
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default KPITable;
