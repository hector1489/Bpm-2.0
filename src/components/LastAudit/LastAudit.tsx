import './LastAudit.css'
import { useNavigate } from 'react-router-dom'
import { useDesviaciones } from '../../hooks/useDesviaciones'

const LastAudit: React.FC = () => {
  const navigate = useNavigate();
  const { desviaciones, loading, error } = useDesviaciones();

  const ultimasDesviaciones = desviaciones ? desviaciones : [];

  const goToControlDesviaciones = (id: number, numeroRequerimiento: string) => {
    navigate('/doc-desviaciones', {
      state: { id, numero_requerimiento: numeroRequerimiento },
    });
  };

  const desviacionesFiltradas = Array.from(
    new Set(ultimasDesviaciones.map((incidencia) => incidencia.numero_requerimiento))
  ).map((numero_requerimiento) => {
    return ultimasDesviaciones.find(
      (incidencia) => incidencia.numero_requerimiento === numero_requerimiento
    );
  });

  return (
    <div className="last-audit-container">
      <h4>Últimas incidencias</h4>
      {loading && <p>Cargando incidencias...</p>}
      {error && <p className="error">{error}</p>}

      <div className="last-audit-cards">
        {desviacionesFiltradas.length > 0 ? (
          desviacionesFiltradas.map((incidencia, index) => (
            incidencia && (
              <div className="last-audit" key={index}>

                <span>Auditoría : {incidencia.numero_requerimiento || 'Sin título'}</span>
                
                  <button
                    onClick={() =>
                      goToControlDesviaciones(
                        incidencia.id,
                        incidencia.numero_requerimiento
                      )
                    }
                  >
                   Editar :  <i className="fa-solid fa-pen-to-square"></i>
                  </button>
              
              </div>
            )
          ))
        ) : (
          <p>No hay incidencias recientes.</p>
        )}
      </div>
    </div>
  )
}

export default LastAudit
