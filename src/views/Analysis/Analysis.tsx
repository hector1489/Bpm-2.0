import './Analysis.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import { IncidentSummary, LastAudit } from '../../components'
import logoFungi from '../../assets/img/logo.jpg'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const Analysis: React.FC = () => {
  const navigate = useNavigate()
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const handleGoToHome = () => {
    navigate('/home')
  }

  const handleDownloadPDF = () => {
    const graphs = [
      { id: 'kpi-graph', title: 'KPI Graph' },
      { id: 'bpm-graph', title: 'BPM Graph' },
      { id: 'lum-graph', title: 'LUM Graph' },
      { id: 'eta-graph', title: 'ETA Graph' }
    ]

    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const promises = graphs.map((graph, index) => {
      const element = document.getElementById(graph.id) as HTMLElement;
      return html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (index > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      });
    });

    Promise.all(promises).then(() => {
      pdf.save('graphs-analysis.pdf');
    });
  }

  return (
    <div className="analysis-container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3>total incidencias</h3>
      <IncidentSummary/>
      <LastAudit />
      <div className="buttons-luminometry">
        <button onClick={handleGoToHome}>Home</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>
    </div>
  )
}

export default Analysis
