import moment from 'moment';
import preguntas from '../questionCriticidad.json'


export const estados = ['Abierto', 'En Progreso', 'Cerrado'];
export const criticidad = [
  { valor: 'Leve', clase: 'prioridad-leve', dias: 45 },
  { valor: 'Moderado', clase: 'prioridad-moderada', dias: 30 },
  { valor: 'Crítico', clase: 'prioridad-critica', dias: 15 }
];

export const calcularCriticidadConPuntaje = (question:string) => {
  const questionMinuscula = question.toLowerCase();
  const resultado = preguntas?.find(item => item.question?.toLowerCase() === questionMinuscula);
  
    
  if (resultado) {
    const puntaje = resultado?.puntaje || 0;

    if (puntaje >= 32 && puntaje <= 64) {
      return "Crítico";
    } else if (puntaje >= 8 && puntaje <= 16) {
      return "Moderado";
    } else if (puntaje >= 1 && puntaje <= 4) {
      return "Leve";
    } else {
      return "Crítico"; 
    }
  } else {
    return "Moderado";
  }
}


export const calcularCriticidad = (nivelCriticidad: string): string | undefined => {
  if (!nivelCriticidad) {
    return 'Nivel de criticidad no válido';
  }

  const nivel = criticidad.find(c => c.valor === nivelCriticidad);

  if (nivel) {
    const fechaSolucion = moment().add(nivel.dias, 'days').format('DD/MM/YYYY');
    return fechaSolucion;
  } else {
    return `No se encontró el nivel de criticidad: ${nivelCriticidad}`;
  }
};



export const calcularDiasRestantesSummary = (fechaIngreso: string, criticidadValor: string): string | null => {
  const formatDate = (fecha: string | null) => {
    if (!fecha) return null;
    const dateObj = new Date(fecha);
    return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split('T')[0];
  };

  if (!fechaIngreso || !criticidadValor) return null;

  const criticidadItem = prioridades.find(c => c.valor === criticidadValor);
  if (!criticidadItem) return null;

  const fechaIngresoFormatted = formatDate(fechaIngreso);
  if (!fechaIngresoFormatted) return null;

  const fechaIngresoDate = new Date(fechaIngresoFormatted);
  fechaIngresoDate.setDate(fechaIngresoDate.getDate() + criticidadItem.diasFechaSolucion);

  const fechaActual = new Date();
  const diferenciaEnMilisegundos = fechaIngresoDate.getTime() - fechaActual.getTime();

  const fechaSolucionProgramada = new Date(fechaActual.getTime() + diferenciaEnMilisegundos);
  const fechaSolucionComoCadena = fechaSolucionProgramada.toLocaleDateString('es-CL');

  return fechaSolucionComoCadena;
};


export const crearSelectEstado = (): HTMLSelectElement => {
  const select = document.createElement('select');

  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    select.appendChild(option);
  });

  return select;
};

export const crearSelectCriticidad = (): HTMLSelectElement => {
  const select = document.createElement('select');

  criticidad.forEach(criticidad => {
    const option = document.createElement('option');
    option.value = criticidad.valor;
    option.textContent = criticidad.valor;
    select.appendChild(option);
  });

  return select;
}


export const getCurrentDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

const prioridades = [
  { valor: 'green', diasFechaSolucion: 45 },
  { valor: 'yellow', diasFechaSolucion: 30 },
  { valor: 'red', diasFechaSolucion: 15 },
];

export const calculateSolutionDate = (criticidad: string): string => {
  const today = new Date();

  // Busca el elemento de criticidad en el array `prioridades`
  const criticidadItem = prioridades.find(c => c.valor === criticidad);
  if (!criticidadItem) {
    console.error(`Error: Criticidad ${criticidad} no encontrada.`);
    return '';
  }

  const daysToAdd = criticidadItem.diasFechaSolucion;

  // Crea una nueva fecha sumando los días de solución al día actual
  const solutionDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  const dd = String(solutionDate.getDate()).padStart(2, '0');
  const mm = String(solutionDate.getMonth() + 1).padStart(2, '0');
  const yyyy = solutionDate.getFullYear();

  return `${yyyy}/${mm}/${dd}`;
};



export const getCriterioByColor = (criticidadColor: string) => {
  if (criticidadColor == 'green') return 'Leve';
  if (criticidadColor == 'yellow') return 'Moderado';
  return 'Crítico';
}

export const getColorByPercentage = (percentage: number) => {
  if (percentage >= 90) return 'green';
  if (percentage >= 75) return 'yellow';
  return 'red';
};



export const getColorByPercentageFilas = (percentage: number) => {
  if (percentage >= 90) return 'green';
  if (percentage >= 75) return 'yellow';
  return 'red';
}

export const getColorByPercentageLum = (percentage: number | null | undefined) => {
  if (percentage === null || percentage === undefined || isNaN(percentage)) {
    return 'bg-light-green';
  } else if (percentage >= 90) {
    return 'bg-light-green';
  } else if (percentage >= 70) {
    return 'bg-yellow';
  } else if (percentage >= 50) {
    return 'bg-red';
  } else {
    return 'bg-danger';
  }
};


// utils/utils.ts
interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export const extractPercentage = (answer: string): number => {
  if (answer === 'N/A') return 100;
  const match = answer.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
};

export const calculateGroupAverage = (tablaDetails: TablaDetail[], modules: string[]): number => {
  const relevantItems = tablaDetails.filter((detail) =>
    modules.includes(detail.field2) && detail.field4 !== 'N/A'
  );
  const total = relevantItems.reduce((acc, item) => acc + parseFloat(item.field4), 0);
  return relevantItems.length > 0 ? total / relevantItems.length : 100;
};


// Define el objeto nombres con un tipo Record para especificar las claves válidas
const nombres: Record<"BPM" | "POES" | "POE" | "MA" | "DOC" | "LUM" | "TRA", string> = {
  BPM: 'INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES',
  POES: 'PROCEDIMIENTOS OP. DE SANITIZACION',
  POE: 'PROCEDIMIENTOS OP. DEL PROCESO',
  MA: 'MANEJO AMBIENTAL',
  DOC: 'DOCUMENTACION',
  LUM: 'LUMINOMETRIA',
  TRA: 'TRAZADORES DE POSIBLE BROTE ETA',
};

// Función para obtener el nombre completo usando el objeto nombres
export const getNombreCompleto = (groupName: keyof typeof nombres): string => {
  return nombres[groupName];
};

// Modifica getGroupedData para usar getNombreCompleto correctamente
export const getGroupedData = (
  tablaDetails: TablaDetail[],
  moduleGroups: { [key: string]: string[] },
  ponderaciones: { [key: string]: number }
) => {
  return Object.entries(moduleGroups).map(([groupName, modules]) => {
    const filteredModules = tablaDetails.filter(detail => modules.includes(detail.field2));
    const validItems = filteredModules.filter(detail => detail.field4 !== null && detail.field4 !== 'N/A');

    const sum = validItems.reduce((acc, curr) => acc + parseFloat(curr.field4), 0);
    const average = validItems.length > 0 ? sum / validItems.length : 100;

    return {
      groupName,
      nombreCompleto: getNombreCompleto(groupName as keyof typeof nombres), // Asegura que sea una clave válida
      percentage: ponderaciones[groupName.toLowerCase()] || 0,
      average,
    };
  });
};





