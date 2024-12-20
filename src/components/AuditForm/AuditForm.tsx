import { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/GlobalState';
import logoFungi from '../../assets/img/logo.jpg';
import './AuditForm.css';
import { Answer } from '../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';
import { subirFoto } from '../../utils/apiPhotosUtils';

const AuditForm: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Answer[]>([]);
  const [photoTaken, setPhotoTaken] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!context) {
    return <div>Error: El contexto no está disponible.</div>;
  }

  const { state, addAnswers } = context;
  const currentQuestion = state.IsHero[currentQuestionIndex];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = [...formData];
    updatedFormData[currentQuestionIndex] = {
      question: currentQuestion?.question || '',
      answer: e.target.value,
    };
    setFormData(updatedFormData);
    setErrorMessage('');
  };

  const handleNext = () => {
    const updatedFormData = [...formData];
    const selectedAnswer = updatedFormData[currentQuestionIndex]?.answer;

    if (!selectedAnswer) {
      setErrorMessage('Por favor, seleccione una respuesta antes de continuar.');
      return;
    }

    if (currentQuestionIndex < state.IsHero.length - 1) {
      setFormData(updatedFormData);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPhotoTaken(false);
    } else {
      addAnswers(updatedFormData);
      navigate('/resumen-auditoria');
    }
  };

  const handleNextNA = () => {
    const updatedFormData = [...formData];

    updatedFormData[currentQuestionIndex] = {
      question: currentQuestion?.question || '',
      answer: 'N/A',
    };

    if (currentQuestionIndex < state.IsHero.length - 1) {
      setFormData(updatedFormData);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPhotoTaken(false);
    } else {
      addAnswers(updatedFormData);
      navigate('/resumen-auditoria');
    }
  };

  const openCamera = async () => {
    const constraints = {
      video: {
        facingMode: { ideal: "environment" }
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play();
        };
      }

      setTimeout(() => capturePhoto(stream), 1000);
    } catch (err) {
      console.error("Error al acceder a la cámara: ", err);
      alert("No se pudo acceder a la cámara.");
    }
  };

  const capturePhoto = async (stream: MediaStream) => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL('image/png');

        const numeroAuditoria = state.auditSheetData.numeroAuditoria

        const questionText = currentQuestion?.question || 'sin_pregunta';
        const sanitizedQuestion = questionText.replace(/\s+/g, '_').toLowerCase();
        const auditDate = state.auditSheetData.fechaAuditoria;
        const fileName = `${numeroAuditoria}_${sanitizedQuestion}_${auditDate}.png`;



        try {

          const responseUrl = await subirFoto(photoUrl, fileName);
          if (responseUrl) {
            console.log('Foto subida al backend con éxito:', responseUrl);
          } else {
            console.warn('No se pudo subir la foto al backend.');
          }
        } catch (error) {
          console.error('Error al subir la foto:', error);
        }

        setPhotoTaken(true);
      }
    }

    stopCamera(stream);
  };

  const stopCamera = (stream: MediaStream) => {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleGoToHome = () => {
    navigate('/home');
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <div>
        <label>
          Pregunta:
          <div>{currentQuestion ? currentQuestion.question : 'No hay más preguntas'}</div>
        </label>
        <label>
          Respuesta:
          <select
            name="answer"
            value={formData[currentQuestionIndex]?.answer || ''}
            onChange={handleChange}
          >
            <option value="">Seleccione una respuesta</option>
            {Array.isArray(currentQuestion?.responses) ? (
              currentQuestion.responses.map((response: string, index: number) => (
                <option key={index} value={response}>
                  {response}
                </option>
              ))
            ) : (
              <option value={currentQuestion?.responses || ''}>
                {currentQuestion?.responses || 'No hay respuestas'}
              </option>
            )}
          </select>
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className='btn-audit-form'>
          <button className='btn-green' type="button" onClick={handleNext}>
            {currentQuestionIndex < state.IsHero.length - 1 ? <i className="fa-solid fa-check"></i> : 'Enviar'}
          </button>
          <button type="button" onClick={openCamera} className="btn-blue camera-button">
            <i className="fa-solid fa-camera"></i>
          </button>
          <button className='bg-black fw-bold' onClick={handleNextNA}>N/A</button>
        </div>
        <div className="audit-form-canvas">
          <video ref={videoRef} autoPlay playsInline></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
        <div className="btn-audit-form-banner">
          <button className='btn-blue' onClick={handleGoToHome}>
            <i className="fa-solid fa-house-chimney"></i> Home
          </button>
        </div>
        {photoTaken && <p>Foto tomada, puede avanzar a la siguiente pregunta.</p>}
      </div>
    </form>
  );
};

export default AuditForm;
