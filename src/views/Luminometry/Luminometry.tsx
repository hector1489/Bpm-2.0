import { LUMGraph } from '../../components/index'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/GlobalState'
import './Luminometry.css'
import { getColorByPercentageLum } from '../../utils/utils'
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
import MyDocument from '../../utils/MyDocument';
import { subirPDF } from '../../utils/apiPdfUtils';

const Luminometry: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [images, setImages] = useState<string[]>([]);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const handleGoToAuditSummary = () => navigate('/resumen-auditoria');
  const handleGoToHome = () => navigate('/');
  const handleGoToDetails = () => navigate('/resumen-detalle');
  const handleGoToETA = () => navigate('/seremi');

  // Define your table data
  const tableData = [
    { url: "0-50", measurement: "I ≤ 2.2", percentage: "100%", note: 7, evaluation: "EXCELENTE", cleanliness: "MUY LIMPIO", riskClassification: "SIN RIESGO" },
    { url: "51-150", measurement: "2.3", percentage: "83%", note: 6, evaluation: "MUY BUENO", cleanliness: "LIMPIO", riskClassification: "SIN RIESGO" },
    { url: "51-150", measurement: "2.4", percentage: "83%", note: 6, evaluation: "MUY BUENO", cleanliness: "LIMPIO", riskClassification: "SIN RIESGO" },
    { url: "51-150", measurement: "2.5", percentage: "83%", note: 6, evaluation: "MUY BUENO", cleanliness: "LIMPIO", riskClassification: "SIN RIESGO" },
    { url: "151-250", measurement: "2.6", percentage: "69%", note: 5, evaluation: "BUENO", cleanliness: "MEDIANAMENTE SUCIO", riskClassification: "BAJO RIESGO" },
    { url: "151-250", measurement: "2.7", percentage: "69%", note: 5, evaluation: "BUENO", cleanliness: "MEDIANAMENTE SUCIO", riskClassification: "BAJO RIESGO" },
    { url: "251-500", measurement: "2.8", percentage: "55%", note: 4, evaluation: "REGULAR", cleanliness: "ALERTA", riskClassification: "RIESGO (LEVE)" },
    { url: "251-500", measurement: "2.9", percentage: "55%", note: 4, evaluation: "REGULAR", cleanliness: "ALERTA", riskClassification: "RIESGO (LEVE)" },
    { url: "501-1000", measurement: "3 ≤ l ≤ 4", percentage: "42%", note: 3, evaluation: "DEFICIENTE", cleanliness: "SUCIO", riskClassification: "MEDIANO RIESGO (GRAVE)" },
    { url: "1001-5000", measurement: "4.1 ≤ l ≤ 4.9", percentage: "28%", note: 2, evaluation: "MALA", cleanliness: "MUY SUCIO", riskClassification: "ALTO RIESGO (MUY GRAVE)" },
    { url: "5001-10000", measurement: "5 ≤ l", percentage: "14%", note: 1, evaluation: "MUY MALA", cleanliness: "TOTALMENTE SUCIO", riskClassification: "MUY ALTO RIESGO (CRÍTICO)" },
  ];

  const handleCaptureImages = async () => {
    const element = document.querySelector('.lum-container') as HTMLElement;
    if (element) {
      setTimeout(async () => {
        const canvas = await html2canvas(element);
        const dataUrl = canvas.toDataURL('image/png');
        setImages([dataUrl]);
      }, 1000);
    }
  };
  
  useEffect(() => {
    handleCaptureImages();
  }, []);

  const numeroAuditoria = state.auditSheetData.numeroAuditoria || 'sin_numero';

  const handleSendPDF = async () => {
    if (images.length > 0) {
      const doc = <MyDocument images={images} />;

      const pdfBlob = await pdf(doc).toBlob();
      const pdfFile = new File([pdfBlob], `luminometria_${numeroAuditoria}_${Date.now()}.pdf`, {
        type: 'application/pdf',
        lastModified: Date.now(),
      });

      try {
        const result = await subirPDF(pdfFile, pdfFile.name);
        alert('PDF enviado exitosamente');
        console.log('PDF enviado exitosamente:', result);
      } catch (error) {
        console.error('Error al enviar el PDF:', error);
      }
    }
  };

  const handleGoToKpi = () => {
    navigate('/kpi');
  }


  return (
    <div className="lum-container">
      <h3>Resumen Luminometria</h3>
      <LUMGraph/>
      <div className="table-responsive">
        <table className="table table-bordered text-center table-sm">
          <thead className="table-light">
            <tr>
              <th scope="col">URL</th>
              <th scope="col">MEDICIÓN DE EQUIPO</th>
              <th scope="col">PORCENTAJE</th>
              <th scope="col">NOTA</th>
              <th scope="col">EVALUACIÓN</th>
              <th scope="col">GRADO DE LIMPIEZA</th>
              <th scope="col">CLASIFICACIÓN DEL RIESGO</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className={getColorByPercentageLum(parseInt(row.percentage))}>
                <td>{row.url}</td>
                <td>{row.measurement}</td>
                <td>{row.percentage}</td>
                <td>{row.note}</td>
                <td>{row.evaluation}</td>
                <td>{row.cleanliness}</td>
                <td>{row.riskClassification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons-luminometry">
        <button className='btn-circle btn-green' onClick={handleGoToAuditSummary}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className='btn-circle btn-blue' onClick={handleGoToDetails} title='Detalle'>
          DTLS
        </button>
        <button className='btn-circle btn-blue' onClick={handleGoToETA} title='ETA'>
          ETA
        </button>
        <button className='btn-circle btn-blue btn-kpi' onClick={handleGoToKpi} title='KPI'>
          KPI
        </button>
        <button className='btn-circle' onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>

        {images.length > 0 && (
          <button onClick={handleSendPDF} className="btn-dd-pdf">
            Enviar PDF <i className="fa-solid fa-upload"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default Luminometry;
