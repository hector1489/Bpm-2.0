import { useState, useContext, useRef, useCallback } from 'react'
import { AppContext } from '../../context/GlobalState'
import './AuditForm.css'
import { Answer } from '../../interfaces/interfaces'
import { useNavigate } from 'react-router-dom'
import { extractPercentage, getCurrentDate, calculateSolutionDate, getColorByPercentage } from '../../utils/utils';

interface IAuditData {
  numeroRequerimiento: number;
  pregunta: string;
  respuesta: string;
  fecha: string;
  auditor: string;
  email: string;
  nombreEstablecimiento: string;
  responsableDelProblema: string;
  solucionProgramada: string;
  accionesCorrectivas: string;
  estado: string;
  photoUrl: string;
}

const DEFAULT_ANSWER = "Sin respuesta";

const AuditForm: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Answer[]>([]);
  const [photoTaken, setPhotoTaken] = useState<boolean>(false);
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [auditData, setAuditData] = useState<IAuditData[]>([]);

  if (!context) {
    return <div>Error: El contexto no está disponible.</div>;
  }

  const { state, addAnswers, addPhoto } = context;
  const currentQuestion = state.IsHero[currentQuestionIndex];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = [...formData];
    updatedFormData[currentQuestionIndex] = {
      question: currentQuestion?.question || '',
      answer: e.target.value,
    };
    setFormData(updatedFormData);
  };

  const handleNext = () => {
    const updatedFormData = [...formData];
    const selectedAnswer = updatedFormData[currentQuestionIndex]?.answer;

    if (!selectedAnswer) {
      const defaultAnswer = currentQuestion?.responses?.[0] || '';
      updatedFormData[currentQuestionIndex] = {
        question: currentQuestion?.question || '',
        answer: defaultAnswer,
      };
    }

    if (currentQuestionIndex < state.IsHero.length - 1) {
      setFormData(updatedFormData);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPhotoTaken(false);
    } else {
      addAnswers(updatedFormData);
      collectAuditData();
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

  const capturePhoto = (stream: MediaStream) => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL('image/png');

        addPhoto(currentQuestion?.question || '', photoUrl);
        setPhotoTaken(true);
      }
    }

    stopCamera(stream);
  }

  const stopCamera = (stream: MediaStream) => {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Función para recolectar todos los datos
  const collectAuditData = useCallback(() => {
    const email = state.auditSheetData.auditorEmail;
    const auditor = state.userName || '';
    const nombreEstablecimiento = state.auditSheetData.nombreEstablecimiento;
    const responsableDelProblema = state.auditSheetData.supervisorEstablecimiento;
    const photos = state.photos;

    const newAuditData = state.IsHero
      .filter((hero) => extractPercentage(hero.answer ?? DEFAULT_ANSWER) < 100)
      .map((hero) => {
        const criticidadColor = getColorByPercentage(extractPercentage(hero.answer ?? DEFAULT_ANSWER));
        const solucionProgramada = calculateSolutionDate(criticidadColor);
        const photo = photos.find(photo => photo.question === hero.question);

        return {
          numeroRequerimiento: hero.id,
          pregunta: hero.question,
          respuesta: hero.answer ?? DEFAULT_ANSWER,
          fecha: getCurrentDate(),
          auditor: auditor,
          email: email,
          nombreEstablecimiento: nombreEstablecimiento,
          responsableDelProblema: responsableDelProblema,
          solucionProgramada: solucionProgramada,
          accionesCorrectivas: '',
          estado: 'Abierto',
          photoUrl: photo ? (photo.photoUrl || 'N/A') : 'N/A'
        };
      });

    setAuditData(newAuditData);
  }, [state]);


  return (
    <form onSubmit={(e) => e.preventDefault()}>
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
        <div className='btn-audit-form'>
          <button type="button" onClick={handleNext}>
            {currentQuestionIndex < state.IsHero.length - 1 ? 'Siguiente' : 'Enviar'}
          </button>
          <button type="button" onClick={openCamera} className="camera-button">
            <i className="fa-solid fa-camera-retro"></i>
          </button>
          <video ref={videoRef} autoPlay playsInline ></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
        {photoTaken && <p>Foto tomada, puede avanzar a la siguiente pregunta.</p>}
      </div>
    </form>
  )
}

export default AuditForm
