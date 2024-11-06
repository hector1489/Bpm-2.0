// Definición de los niveles de probabilidad y consecuencia
export const nivelesProbabilidad = {
  INSIGNIFICANTE: 1,
  BAJA: 2,
  MEDIA: 4,
  ALTA: 8
} as const;

export const nivelesConsecuencia = {
  INSIGNIFICANTE: 1,
  BAJA: 2,
  MEDIA: 4,
  ALTA: 8
} as const;

// Definición de los rangos de criticidad
export const criticidadRangos = {
  CRITICO: { min: 32, max: 64, tiempoDias: 15, alertaFrecuencia: 3 },
  MODERADO: { min: 8, max: 16, tiempoDias: 30, alertaFrecuencia: 6 },
  LEVE: { min: 1, max: 4, tiempoDias: 45, alertaFrecuencia: 9 }
} as const;

// Tipos para asegurar valores específicos en los parámetros y retorno
export type Probabilidad = keyof typeof nivelesProbabilidad;
export type Consecuencia = keyof typeof nivelesConsecuencia;

interface CriticidadInfo {
  nivel: string;
  tiempoDias: number;
  alertaFrecuencia: number;
}

interface ImpactoInocuidadResultado {
  puntaje: number;
  criticidad: string;
  tiempoDiasParaResolver: number;
  frecuenciaAlertas: number;
}

// Función para calcular el puntaje total en base a probabilidad y consecuencia
export function calcularPuntaje(probabilidad: Probabilidad, consecuencia: Consecuencia): number {
  return nivelesProbabilidad[probabilidad] * nivelesConsecuencia[consecuencia];
}

// Función para determinar el nivel de criticidad
export function determinarCriticidad(puntaje: number): CriticidadInfo {
  if (puntaje >= criticidadRangos.CRITICO.min && puntaje <= criticidadRangos.CRITICO.max) {
    return { nivel: 'CRITICO', ...criticidadRangos.CRITICO };
  } else if (puntaje >= criticidadRangos.MODERADO.min && puntaje <= criticidadRangos.MODERADO.max) {
    return { nivel: 'MODERADO', ...criticidadRangos.MODERADO };
  } else if (puntaje >= criticidadRangos.LEVE.min && puntaje <= criticidadRangos.LEVE.max) {
    return { nivel: 'LEVE', ...criticidadRangos.LEVE };
  } else {
    return { nivel: 'NO CLASIFICADO', tiempoDias: 0, alertaFrecuencia: 0 };
  }
}

// Función principal para evaluar el impacto en inocuidad
export function evaluarImpactoEnInocuidad(
  probabilidad: Probabilidad,
  consecuencia: Consecuencia
): ImpactoInocuidadResultado {
  const puntaje = calcularPuntaje(probabilidad, consecuencia);
  const criticidad = determinarCriticidad(puntaje);

  return {
    puntaje,
    criticidad: criticidad.nivel,
    tiempoDiasParaResolver: criticidad.tiempoDias,
    frecuenciaAlertas: criticidad.alertaFrecuencia
  };
}

