import { DetailsTable, ETAGraph, ETATable } from '../../components'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './DocumentacionView.css'

const DocumentacionView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

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
      }, 0);

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
    navigate('/');
  }

  const handleDownloadPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const graphElement = document.getElementById('etagrap-container');
    if (graphElement) {
      const canvas = await html2canvas(graphElement);
      const graphImgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(graphImgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    doc.addPage();

    const etaTableElement = document.getElementById('etatable-container');
    if (etaTableElement) {
      const canvas = await html2canvas(etaTableElement);
      const tableImgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(tableImgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    doc.addPage();

    const detailsTableElement = document.getElementById('detailstable-container');
    if (detailsTableElement) {
      const canvas = await html2canvas(detailsTableElement);
      const detailsImgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(detailsImgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    doc.save('documentacion.pdf');
  }

  return (
    <div className="documentacion-container">
      <h3>Documentación</h3>

      <div id="etagrap-container">
        <ETAGraph moduleData={moduleData} />
      </div>

      <div id="etatable-container">
        <ETATable />
      </div>

      <div id="detailstable-container">
        <DetailsTable />
      </div>

      <div className="buttons-summary">
        <button onClick={handleGoToHome}>Home</button>
        <button onClick={handleDownloadPDF}>Descargar en PDF</button>
      </div>
    </div>
  )
}

export default DocumentacionView
