import { useState, useEffect, useContext, useMemo } from 'react';
import { cargarDesviacionesDesdeBackend } from '../utils/apiUtils';
import { AppContext } from '../context/GlobalState';

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

export const useDesviaciones = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [desviaciones, setDesviaciones] = useState<DesviacionResponse[] | null>(null);

  useEffect(() => {
    const fetchDesviaciones = async () => {
      setLoading(true);
      try {
        if (context?.state.authToken) {
          const data = await cargarDesviacionesDesdeBackend(context.state.authToken);
          setDesviaciones(data);
        }
      } catch (error) {
        setError('Error al cargar desviaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchDesviaciones();
  }, [context?.state.authToken]);
  
  const { responsableCount, statusCounts, statusCountsEstados } = useMemo(() => {
    if (!desviaciones) return { responsableCount: {}, statusCounts: {}, statusCountsEstados: {} };

    const responsableCount = desviaciones.reduce((acc: Record<string, number>, item: DesviacionResponse) => {
      const responsable = item.responsable_problema;
      if (responsable) {
        acc[responsable] = (acc[responsable] || 0) + 1;
      }
      return acc;
    }, {});

    const statusCounts = desviaciones.reduce((acc, item) => {
      const criticidadLower = item.criticidad.toLowerCase();
      if (criticidadLower === 'leve') acc.leve++;
      else if (criticidadLower === 'moderado') acc.moderado++;
      else if (criticidadLower === 'critico') acc.critico++;
      return acc;
    }, { leve: 0, moderado: 0, critico: 0 });

    const statusCountsEstados = desviaciones.reduce((acc, item) => {
      const estadoLower = item.estado.toLowerCase();
      if (estadoLower === 'abierto') acc.abierto++;
      else if (estadoLower === 'en progreso') acc.enProgreso++;
      else if (estadoLower === 'cerrado') acc.cerrado++;
      return acc;
    }, { abierto: 0, enProgreso: 0, cerrado: 0 });

    return { responsableCount, statusCounts, statusCountsEstados };
  }, [desviaciones]);

  return { desviaciones, loading, error, responsableCount, statusCounts, statusCountsEstados };
};
