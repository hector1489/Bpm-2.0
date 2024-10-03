import { useState, useContext, useEffect } from 'react'
import { cargarDesviacionesDesdeBackend } from '../../utils/apiUtils'
import './AuditSheet.css'
import logoFungi from '../../assets/img/logo.jpg'
import { AppContext } from '../../context/GlobalState'
import { useNavigate } from 'react-router-dom'

interface DesviacionResponse {
  id: number;
  numero_requerimiento: string;
  preguntas_auditadas: string;
  desviacion_o_criterio: string;
  responsable_problema: string;
  local: string;
  criticidad: string;
  acciones_correctivas: string;
  fecha_recepcion_solicitud: string;
  fecha_solucion_programada: string;
  estado: string;
  fecha_cambio_estado: string;
  contacto_clientes: string;
  evidencia_fotografica: string;
  auditor: string;
  correo: string;
}

const AuditSheet: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const { updateAuditSheetData } = context;
  const { state } = context;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [auditCount, setAuditCount] = useState<number>(1);

  const fetchDesviaciones = async () => {
    const authToken = state.authToken;
    setLoading(true);

    try {
      if (authToken) {
        const data: DesviacionResponse[] = await cargarDesviacionesDesdeBackend(authToken);
        if (data) {
          const mappedData = data.map((item: DesviacionResponse) => ({
            id: item.id,
            numero_requerimiento: item.numero_requerimiento,
            preguntas_auditadas: item.preguntas_auditadas,
            desviacion_o_criterio: item.desviacion_o_criterio,
            responsable_problema: item.responsable_problema,
            local: item.local,
            criticidad: item.criticidad,
            acciones_correctivas: item.acciones_correctivas,
            fecha_recepcion_solicitud: item.fecha_recepcion_solicitud,
            fecha_solucion_programada: item.fecha_solucion_programada,
            estado: item.estado,
            fecha_cambio_estado: item.fecha_cambio_estado,
            contacto_clientes: item.contacto_clientes,
            evidencia_fotografica: item.evidencia_fotografica,
            auditor: item.auditor,
            correo: item.correo,
          }));

          const lastAuditNumber = mappedData.reduce((max, item) => {
            const num = parseInt(item.numero_requerimiento, 10);
            return num > max ? num : max;
          }, 0);

          setAuditCount(lastAuditNumber + 1);
        }
      } else {
        console.error('No se pudo obtener el token de autenticación.');
        setError('Token de autenticación no disponible.');
      }
    } catch (error) {
      console.error('Error al cargar las desviaciones:', error);
      setError('No se pudieron cargar las desviaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesviaciones();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formValues, setFormValues] = useState({
    nombreEstablecimiento: '',
    numeroAuditoria: auditCount.toString(),
    gerenteEstablecimiento: '',
    administradorEstablecimiento: '',
    supervisorEstablecimiento: '',
    auditorEmail: '',
    fechaAuditoria: getCurrentDate()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSave = () => {
    const updatedFormValues = {
      ...formValues,
      numeroAuditoria: auditCount.toString()
    };
    updateAuditSheetData(updatedFormValues);
    handleGoToAuditoria();
    alert('Datos guardados exitosamente');
    setAuditCount(prevCount => prevCount + 1);
  };

  const handleGoToAuditoria = () => {
    navigate('/auditoria');
  };

  return (
    <div id="module-ficha" className="module-section">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3 className="text-center">Ficha de Auditoría</h3>
      {loading && <p>Cargando desviaciones...</p>}
      {error && <p className="error">{error}</p>}

      <form id="form-ficha">
        <div className="form-group">
          <label htmlFor="nombre-establecimiento">Nombre de Establecimiento:</label>
          <input
            type="text"
            className="form-control"
            id="nombre-establecimiento"
            name="nombreEstablecimiento"
            placeholder="Ej: local"
            value={formValues.nombreEstablecimiento}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="numero-auditoria">N° de Auditoría:</label>
          <input
            type="text"
            className="form-control"
            id="numero-auditoria"
            name="numeroAuditoria"
            value={auditCount.toString()}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gerente-establecimiento">Gerente de Establecimiento:</label>
          <input
            type="text"
            className="form-control"
            id="gerente-establecimiento"
            name="gerenteEstablecimiento"
            value={formValues.gerenteEstablecimiento}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="administrador-establecimiento">Administrador de Establecimiento:</label>
          <input
            type="text"
            className="form-control"
            id="administrador-establecimiento"
            name="administradorEstablecimiento"
            value={formValues.administradorEstablecimiento}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="supervisor-establecimiento">Responsable del Problema:</label>
          <select
            className="form-control"
            id="supervisor-establecimiento"
            name="supervisorEstablecimiento"
            value={formValues.supervisorEstablecimiento}
            onChange={handleChange}
          >
            <option value="gerente-contrato">Gerente De Contrato</option>
            <option value="administrador">Administrador</option>
            <option value="supervisor-mantencion">Supervisor De Mantención</option>
            <option value="supervisor-casino">Supervisor De Casino</option>
            <option value="supervisor-aseo">Supervisor De Aseo</option>
            <option value="coordinador-calidad">Coordinador De Calidad</option>
            <option value="asesor-sso">Asesor SSO</option>
            <option value="asesor-medio-ambiente">Asesor Medio Ambiente</option>
            <option value="jefe-rh">Jefe RH</option>
            <option value="bodeguero">Bodeguero</option>
            <option value="chef">Chef</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="auditor-email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="auditor-email"
            name="auditorEmail"
            value={formValues.auditorEmail}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha-auditoria">Fecha de Auditoría:</label>
          <input
            type="date"
            className="form-control"
            id="fecha-auditoria"
            name="fechaAuditoria"
            value={formValues.fechaAuditoria}
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-form btn-green" onClick={handleSave}>
          Guardar y avanzar
        </button>
      </form>
    </div>
  )
}

export default AuditSheet
