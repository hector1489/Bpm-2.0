import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
import DetailsDocument from '../../utils/DetailsDocument';
import logos from '../../assets/img/index';
import './DetailsView.css';
import { AverageTable, PhotoAudit, DetailsTable } from '../../components';
import { subirPDF } from '../../utils/apiPdfUtils';

const logoHome = logos.logoHome;
const logoLum = logos.logoLum;
const logoTra = logos.logoTra;

const DetailsView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [images, setImages] = useState<string[]>([]);

  if (!context) {
    throw new Error('DetailsView debe ser utilizado dentro de un AppProvider');
  }

  const { state } = context;

  const captureSection = async (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        width: element.scrollWidth,
        height: element.scrollHeight,
        useCORS: true,
        ignoreElements: (el) => el.classList.contains('detail-button') || el.classList.contains('buttons-summary-logo')
      });
      const dataUrl = canvas.toDataURL('image/png');
      return dataUrl;
    }
    return '';
  };

  const handleCaptureImages = async () => {
    const image1 = await captureSection('.details-table-container');
    const image2 = await captureSection('.average-table-container');
    const image3 = await captureSection('.photo-audit-container');

    setImages([image1, image2, image3]);
  };

  useEffect(() => {
    handleCaptureImages();
  }, []);

  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  };

  const handleGoToETA = () => {
    navigate('/seremi');
  };

  const handleNext = async () => {
    if (images.length > 0) {
      const doc = <DetailsDocument images={images} />;

      const pdfBlob = await pdf(doc).toBlob();
      
      const numeroAuditoria = state.auditSheetData.numeroAuditoria || 'sin_numero';

      const pdfFile = new File([pdfBlob], `detalle_auditoria_${numeroAuditoria}_${Date.now()}.pdf`, {
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

    handleGoToLuminometry();
  };

  return (
    <div className="detail-container">
      <h3 className='fw-bold'>Detalle</h3>
      <p>Auditoria : <span>{state.auditSheetData.numeroAuditoria}</span></p>

      <div className="details-table-container">
        <DetailsTable />
      </div>

      <div className="average-table-container">
        <AverageTable />
      </div>

      <div className="photo-audit-container">
        <PhotoAudit photos={state.photos} />
      </div>

      <div className="detail-button">
        <button onClick={handleNext}>
          Siguiente <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>


      <div className="buttons-summary-logo">
        <div className="btn" onClick={handleGoToAuditSummary} title='Volver'>
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="btn">
          <img src={logoLum} alt="lum" onClick={handleGoToLuminometry} title='LUM'/>
        </div>
        <div className="btn">
          <img src={logoTra} alt="tra" onClick={handleGoToETA} title='TRA'/>
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home'/>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
