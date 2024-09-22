import './KPITable.css'

const KPITable: React.FC = () => {


  return (
    <div className="kpi-table-container">
      <table id="kpiTable" className="table table-bordered text-center table-sm">
        <thead>
          <tr>
            <th>INDICADOR</th>
            <th>PONDERACION ITEM CODELCO (25%)</th>
            <th>PROMEDIO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ALIMENTACION INSP. BPM</td>
            <td>25%</td>
            <td><span id="kpiInsp"></span>%</td>
          </tr>
          <tr>
            <td>ALIMENTACION CUM. INUTAS</td>
            <td>25%</td>
            <td><span id="kpiCum"></span>%</td>
          </tr>
          <tr>
            <td>ALIMENTACION EXAM. MANIP.</td>
            <td>25%</td>
            <td><span id="kpiExam"></span>%</td>
          </tr>
          <tr>
            <td>ALIMENTACION INAP. MICROB.</td>
            <td>25%</td>
            <td><span id="kpiInap"></span>%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="bg-warning">
            <td colSpan={2}>TOTAL ALIMENTACION</td>
            <td><span id="totalkpi"></span> %</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default KPITable