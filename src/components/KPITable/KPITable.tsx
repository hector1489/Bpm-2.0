import './KPITable.css'
import { useState, useEffect } from 'react'


type KpiKeys = 'kpiInsp' | 'kpiCum' | 'kpiExam' | 'kpiInap' | 'totalKpi';

const KPITable: React.FC = () => {

  const kpiDataTable: { module: string; ponderacion: string; promedioId: KpiKeys }[] = [
    { module: 'ALIMENTACION INSP. BPM', ponderacion: '25%', promedioId: 'kpiInsp' },
    { module: 'ALIMENTACION CUM. INUTAS', ponderacion: '25%', promedioId: 'kpiCum' },
    { module: 'ALIMENTACION EXAM. MANIP.', ponderacion: '25%', promedioId: 'kpiExam' },
    { module: 'ALIMENTACION INAP. MICROB.', ponderacion: '25%', promedioId: 'kpiInap' },
  ];

  const [promedios, setPromedios] = useState<Record<KpiKeys, number>>({
    kpiInsp: 0,
    kpiCum: 0,
    kpiExam: 0,
    kpiInap: 0,
    totalKpi: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      const promediosData = {
        kpiInsp: 90,
        kpiCum: 85,
        kpiExam: 95,
        kpiInap: 80,
      };

      const totalKpi = parseFloat((
        (promediosData.kpiInsp +
          promediosData.kpiCum +
          promediosData.kpiExam +
          promediosData.kpiInap) /
        4
      ).toFixed(2));

      setPromedios({ ...promediosData, totalKpi });
    }, 1000);
  }, []);

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
  )
}

export default KPITable
