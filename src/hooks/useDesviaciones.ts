import { useState, useEffect, useContext, useMemo } from 'react';
import { cargarDesviacionesDesdeBackend, actualizarDesviacionBackend } from '../utils/apiUtils';
import { AppContext } from '../context/GlobalState';
import { DesviacionResponse } from '../interfaces/interfaces';

export const useDesviaciones = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [desviaciones, setDesviaciones] = useState<DesviacionResponse[] | null>(null);

  useEffect(() => {
    const fetchDesviaciones = async () => {
      setLoading(true);
      setError(null);

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

export const useUpdateDesviaciones = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarDesviaciones = async (desviaciones: DesviacionResponse[], authToken: string) => {
    setIsLoading(true);
    setError(null);

    const updatePromises = desviaciones.map(async (desviacion) => {
      try {
        await actualizarDesviacionBackend(desviacion.id, desviacion, authToken);
        console.log(`Desviación con ID ${desviacion.id} actualizada correctamente.`);
      } catch (err) {
        console.error(`Error al actualizar la desviación con ID ${desviacion.id}:`, err);
        return { error: `Error al actualizar la desviación con ID ${desviacion.id}.` };
      }
    });

    const results = await Promise.allSettled(updatePromises);

    results.forEach(result => {
      if (result.status === 'rejected') {
        setError(result.reason);
      }
    });

    setIsLoading(false);
  };

  return { actualizarDesviaciones, isLoading, error };
};
