import './LastAudit.css'
import { useNavigate } from 'react-router-dom'
import { useDesviaciones } from '../../hooks/useDesviaciones'

const LastAudit: React.FC = () => {
  const navigate = useNavigate();
  const { desviaciones, loading, error } = useDesviaciones();

  const ultimasDesviaciones = desviaciones ? desviaciones.slice(-5) : [];

  const goToControlDesviaciones = (id: number, numeroRequerimiento: string) => {
    navigate('/doc-desviaciones', {
      state: { id, numero_requerimiento: numeroRequerimiento },
    });
  };

  return (
    <div className="last-audit-container">
      <h4>Últimas incidencias</h4>
      {loading && <p>Cargando incidencias...</p>}
      {error && <p className="error">{error}</p>}

      <div className="last-audit-cards">
        {ultimasDesviaciones.length > 0 ? (
          ultimasDesviaciones.map((incidencia, index) => (
            <div className="last-audit" key={index}>
              <button
                onClick={() =>
                  goToControlDesviaciones(
                    incidencia.id,
                    incidencia.numero_requerimiento
                  )
                }
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <span>{incidencia.numero_requerimiento || 'Sin título'}</span>
            </div>
          ))
        ) : (
          <p>No hay incidencias recientes.</p>
        )}
      </div>
    </div>
  )
}

export default LastAudit
