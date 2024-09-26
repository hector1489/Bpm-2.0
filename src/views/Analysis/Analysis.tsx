import './Analysis.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import { BPMGraph, ETAGraph, KPIGraph, LUMGraph } from '../../components'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const Analysis: React.FC = () => {
  const navigate = useNavigate()
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context

  const calculatePercentage = (moduleId: number): number => {
    try {
      const moduleQuestions = state.IsHero.filter(question => question.id === moduleId);
      const totalQuestions = moduleQuestions.length;

      if (totalQuestions === 0) {
        return 100;
      }

      const totalPercentage = moduleQuestions.reduce((acc, question) => {
        if (question.answer && typeof question.answer === 'string') {
          const match = question.answer.match(/(\d+)%/);
          const percentage = match ? parseInt(match[1], 10) : 0;
          return acc + percentage;
        } else {
          return acc;
        }
      }, 0)

      return totalPercentage / totalQuestions;
    } catch (error) {
      console.error('Error calculating percentage for module:', moduleId, error);
      return 100;
    }
  }

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }))

  const handleGoToHome = () => {
    navigate('/')
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

  const handleGoToDoc = () => {
    navigate('/documentacion');
  }

  return (
    <div className="analysis-container">
      <h3>Analisis</h3>
      <div id="kpi-graph">
        <KPIGraph moduleData={moduleData} />
      </div>
      <div id="bpm-graph">
        <BPMGraph moduleData={moduleData} />
      </div>
      <div id="lum-graph">
        <LUMGraph moduleData={moduleData} />
      </div>
      <div id="eta-graph">
        <ETAGraph moduleData={moduleData} />
      </div>

      <div className="buttons-luminometry">
        <button onClick={handleGoToHome}>Home</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
        <button onClick={handleGoToDoc}>Volver</button>
      </div>
    </div>
  )
}

export default Analysis
