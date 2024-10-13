import { LUMGraph } from '../../components/index'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/GlobalState'
import './Luminometry.css'
import html2canvas from 'html2canvas'
import { pdf } from '@react-pdf/renderer'
import LUMDocument from '../../utils/LumDocument'
import { subirPDF } from '../../utils/apiPdfUtils'
import logos from '../../assets/img/index'

const logoDetails = logos.logoDetails
const logoHome = logos.logoHome
const logoTra = logos.logoTra

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

  const handleCaptureImages = async () => {
    const element = document.querySelector('.lum-container') as HTMLElement;
  if (element) {
    setTimeout(async () => {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true, 
        ignoreElements: (el) => el.classList.contains('detail-button') || el.classList.contains('buttons-summary-logo') // Excluir los botones
      });
      const dataUrl = canvas.toDataURL('image/png');
      setImages([dataUrl]);
    }, 1000);
  }
  };

  useEffect(() => {
    handleCaptureImages();
  }, []);

  const numeroAuditoria = state.auditSheetData.numeroAuditoria || 'sin_numero';

  const handleNext = async () => {
    if (images.length > 0) {
      const doc = <LUMDocument images={images} />;

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

    handleGoToETA();
  }



  return (
    <div className="lum-container">
      <h3>Resumen Luminometria</h3>
      <LUMGraph />
      <div className="table-responsive">
        <table className="table table-bordered text-center table-sm" style={{ fontSize: '12px' }}>
          <thead className="table-light">
            <tr>
              <th>URL</th>
              <th>MEDICIÓN DE EQUIPO</th>
              <th>PORCENTAJE</th>
              <th>NOTA</th>
              <th>EVALUACIÓN</th>
              <th>GRADO DE LIMPIEZA</th>
              <th>CLASIFICACIÓN DEL RIESGO</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td>0-50</td>
              <td>I ≤ 2.2</td>
              <td>100%</td>
              <td>7</td>
              <td>EXCELENTE</td>
              <td>MUY LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td>51-150</td>
              <td>2.3</td>
              <td>83%</td>
              <td>6</td>
              <td>MUY BUENO</td>
              <td>LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td>51-150</td>
              <td>2.4</td>
              <td>83%</td>
              <td>6</td>
              <td>MUY BUENO</td>
              <td>LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#99cc00' }}>
              <td>51-150</td>
              <td>2.5</td>
              <td>83%</td>
              <td>6</td>
              <td>MUY BUENO</td>
              <td>LIMPIO</td>
              <td>SIN RIESGO</td>
            </tr>

            <tr style={{ backgroundColor: '#ffff00' }}>
              <td>151-250</td>
              <td>2.6</td>
              <td>69%</td>
              <td>5</td>
              <td>BUENO</td>
              <td>MEDIANAMENTE SUCIO</td>
              <td>BAJO RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td>151-250</td>
              <td>2.7</td>
              <td>69%</td>
              <td>5</td>
              <td>BUENO</td>
              <td>MEDIANAMENTE SUCIO</td>
              <td>BAJO RIESGO</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td>251-500</td>
              <td>2.8</td>
              <td>55%</td>
              <td>4</td>
              <td>REGULAR</td>
              <td>ALERTA</td>
              <td>RIESGO (LEVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ffff00' }}>
              <td>251-500</td>
              <td>2.9</td>
              <td>55%</td>
              <td>4</td>
              <td>REGULAR</td>
              <td>ALERTA</td>
              <td>RIESGO (LEVE)</td>
            </tr>

            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td>501-1000</td>
              <td>3 ≤ l ≤ 4</td>
              <td>42%</td>
              <td>3</td>
              <td>DEFICIENTE</td>
              <td>SUCIO</td>
              <td>MEDIANO RIESGO (GRAVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td>1001-5000</td>
              <td>4.1 ≤ l ≤ 4.9</td>
              <td>28%</td>
              <td>2</td>
              <td>MALA</td>
              <td>MUY SUCIO</td>
              <td>ALTO RIESGO (MUY GRAVE)</td>
            </tr>
            <tr style={{ backgroundColor: '#ff0000', color: 'white' }}>
              <td>5001-10000</td>
              <td>5 ≤ l</td>
              <td>14%</td>
              <td>1</td>
              <td>MUY MALA</td>
              <td>TOTALMENTE SUCIO</td>
              <td>MUY ALTO RIESGO (CRÍTICO)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="detail-button">
      <button onClick={handleNext}>
        Siguiente <i className="fa-solid fa-arrow-right"></i>
      </button>
      </div>
      

      <div className="buttons-summary-logo">
        <div className="btn" onClick={handleGoToAuditSummary} title='Volver' >
          <i className="fa-solid fa-arrow-left" ></i>
        </div>
        <div className="btn">
          <img src={logoDetails} alt="details" onClick={handleGoToDetails} title='Details' />
        </div>
        <div className="btn">
          <img src={logoTra} alt="tra" onClick={handleGoToETA} title='TRA' />
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home' />
        </div>

      </div>

    </div>
  );
}

export default Luminometry;
