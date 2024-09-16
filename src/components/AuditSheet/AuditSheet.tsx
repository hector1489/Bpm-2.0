import { useState, useContext } from 'react';
import './AuditSheet.css';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom'

const AuditSheet: React.FC = () => {
  const context = useContext(AppContext)
  const navigate = useNavigate()

  const handleGoToAuditoria = () => {
    navigate('/auditoria')
  }



  if (!context) {
    throw new Error('AppContext must be used within an AppProvider')
  }

  const { updateAuditSheetData } = context
  const [formValues, setFormValues] = useState({
    nombreEstablecimiento: '',
    numeroAuditoria: '',
    gerenteEstablecimiento: '',
    administradorEstablecimiento: '',
    supervisorEstablecimiento: '',
    auditorExterno: '',
    fechaAuditoria: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSave = () => {
    updateAuditSheetData(formValues);
    handleGoToAuditoria();
    alert('Datos guardados exitosamente');
  };



  return (
    <div id="module-ficha" className="module-section">
      <h3 className="text-center">Ficha de Auditoría</h3>

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
            value={formValues.numeroAuditoria}
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
          <label htmlFor="auditor-externo">Email:</label>
          <input
            type="email"
            className="form-control"
            id="auditor-externo"
            name="auditorExterno"
            value={formValues.auditorExterno}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha-auditoria">Fecha:</label>
          <input
            type="date"
            className="form-control"
            id="fecha-auditoria"
            name="fechaAuditoria"
            value={formValues.fechaAuditoria}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-form btn-green" onClick={handleSave}>
            <i className="fa-solid fa-save"></i> Guardar y avanzar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuditSheet;
