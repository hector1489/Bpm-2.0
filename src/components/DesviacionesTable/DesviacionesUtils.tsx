import { DesviacionResponse } from '../../interfaces/interfaces';
import { obtenerTodasLasAccionesDesdeAPI } from '../../utils/apiUtils';
import { getCurrentDate } from '../../utils/utils';
import { sendEmail } from '../../utils/apiUtils';
import {
  calcularPuntaje,
  determinarCriticidad,
  Probabilidad,
  Consecuencia,
} from '../../utils/utilsInocuidad'


const prioridades = [
  { valor: 'Leve', diasFechaSolucion: 45 },
  { valor: 'Moderado', diasFechaSolucion: 30 },
  { valor: 'Crítico', diasFechaSolucion: 15 }
];

export const calcularFechaSolucionProgramada = (fechaIngreso: string, criticidad: string): string => {
  const prioridad = prioridades.find(p => p.valor === criticidad);
  if (!prioridad) return fechaIngreso;

  // Parse fechaIngreso in yyyy-mm-dd format
  const [yyyy, mm, dd] = fechaIngreso.split('-').map(Number);
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) {
    console.error('Fecha de ingreso inválida:', fechaIngreso);
    return fechaIngreso;
  }

  // Create date object and add priority days
  const fecha = new Date(yyyy, mm - 1, dd);
  fecha.setDate(fecha.getDate() + prioridad.diasFechaSolucion);

  // Format to yyyy-mm-dd
  const nuevaFecha = [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0')
  ].join('-');

  return nuevaFecha;
};



export const replaceNA = (value: string) => (value === 'N/A' ? '' : value);

export const getFieldFromCellIndex = (index: number): keyof DesviacionResponse => {
  switch (index) {
    case 1:
      return 'numero_requerimiento';
    case 2:
      return 'preguntas_auditadas';
    case 3:
      return 'desviacion_o_criterio';
    case 4:
      return 'responsable_problema';
    case 5:
      return 'local';
    case 6:
      return 'criticidad';
    case 7:
      return 'acciones_correctivas';
    case 8:
      return 'fecha_recepcion_solicitud';
    case 9:
      return 'fecha_solucion_programada';
    case 10:
      return 'estado';
    case 11:
      return 'contacto_clientes';
    case 12:
      return 'evidencia_fotografica';
    case 13:
      return 'auditor';
    case 14:
      return 'correo';
    default:
      throw new Error('Índice de celda inválido');
  }
};

export const getColorByCriticidad = (criticidad: string) => {
  switch (criticidad) {
    case 'Leve':
      return 'green';
    case 'Moderado':
      return 'yellow';
    case 'Crítico':
      return 'red';
    default:
      return 'white'; 
  }
};



export const formatDate = (dateString: string | null | undefined): string => {
  return dateString ? dateString.split('T')[0] : getCurrentDate();
};


export const crearSelectCriticidad = (): HTMLSelectElement => {
  const select = document.createElement('select');
  select.className = 'form-control';
  const opciones = ['Leve', 'Moderado', 'Crítico'];

  opciones.forEach(opcion => {
    const option = document.createElement('option');
    option.value = opcion;
    option.text = opcion;
    select.appendChild(option);
  });

  return select;
};

export const crearSelectEstado = (): HTMLSelectElement => {
  const select = document.createElement('select');
  select.className = 'form-control';
  const estados = ['Abierto', 'En Progreso', 'Cerrado'];

  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.text = estado;
    select.appendChild(option);
  });

  return select;
};

export const crearSelectAcciones = async (authToken: string, preguntaAuditada: string): Promise<HTMLSelectElement> => {
  try {
    const acciones = await obtenerTodasLasAccionesDesdeAPI(authToken);

    const obtenerPrefijo = (pregunta: string) => {
      const match = pregunta.match(/^\w+\s*\d*\./);
      return match ? match[0].trim().toLowerCase() : '';
    };

    const prefijoPreguntaAuditada = obtenerPrefijo(preguntaAuditada || '').toLowerCase();

    const accionesFiltradas = acciones
      .filter((accionObj: { question: string }) => {
        const prefijoPreguntaAccion = obtenerPrefijo(accionObj.question || '').toLowerCase();
        return prefijoPreguntaAccion === prefijoPreguntaAuditada;
      })
      .flatMap((accionObj: { action: string[] }) => accionObj.action);

    const select = document.createElement('select');
    select.className = 'form-control';

    if (accionesFiltradas.length > 0) {
      accionesFiltradas.forEach((accion: string) => {
        const option = document.createElement('option');
        option.value = accion;
        option.text = accion;
        select.appendChild(option);
      });
    } else {
      acciones.forEach((accionObj: { action: string[] }) => {
        accionObj.action.forEach((accion: string) => {
          const option = document.createElement('option');
          option.value = accion;
          option.text = accion;
          select.appendChild(option);
        });
      });
    }

    return select;
  } catch (error) {
    console.error('Error al crear el select de acciones correctivas:', error);
    const select = document.createElement('select');
    select.className = 'form-control';
    const option = document.createElement('option');
    option.value = '';
    option.text = 'Error al cargar acciones';
    select.appendChild(option);
    return select;
  }
};



export const crearSelectFechaIngreso = (): HTMLSelectElement => {
  const select = document.createElement('select');
  select.className = 'form-control';

  const formatDate = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const currentDate = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const formattedDate = formatDate(date);

    const option = document.createElement('option');
    option.value = formattedDate;
    option.text = formattedDate;
    select.appendChild(option);
  }

  return select;
};

// Import criticidad or ensure it's accessible in this file
export const calcularDiasRestantes = (fechaIngreso: string, criticidadValor: string): number => {
  if (!fechaIngreso || !criticidadValor) return 0;


  // Use criticidad array to find the corresponding days
  const criticidadItem = prioridades.find(c => c.valor === criticidadValor);
  if (!criticidadItem) return 0;

  let dd, mm, yyyy;

  // Detect date format and parse (assuming it's yyyy-mm-dd)
  if (fechaIngreso.includes('-')) {
    [yyyy, mm, dd] = fechaIngreso.split('-').map(Number);
  } else if (fechaIngreso.includes('/')) {
    [dd, mm, yyyy] = fechaIngreso.split('/').map(Number);
  } else {
    return 0;
  }

  // Ensure parsed date is valid
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return 0;

  const fechaIngresoDate = new Date(yyyy, mm - 1, dd);
  if (isNaN(fechaIngresoDate.getTime())) return 0;

  // Add days based on criticidad
  fechaIngresoDate.setDate(fechaIngresoDate.getDate() + criticidadItem.diasFechaSolucion);

  const fechaActual = new Date(); 

  // Calculate remaining days
  const diferenciaEnMilisegundos = fechaIngresoDate.getTime() - fechaActual.getTime();
  const diasRestantes = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

  return diasRestantes > 0 ? diasRestantes : 0;
};

export const sendTableEmail = async (
  emailAudit: string,
  numeroAuditoria: string,
  tableData: Array<{
    numeroRequerimiento: string;
    preguntasAuditadas: string;
    criterio: string;
    responsable: string;
    establecimiento: string;
    criticidad: string;
    accionesCorrectivas: string;
    fechaIngreso: string;
    fechaSolucionProgramada: string;
    estado: string;
    contactoClientes: string;
    evidenciaFotografica: string;
    auditor: string;
    correo: string;
    diasRestantes: string;
  }>
): Promise<string> => {
  try {
    await sendEmail(
      emailAudit,
      'Número de Auditoría',
      `Alerta CBPfood Auditoria BPM realizada:
      Se han ingresado nuevas desviaciones correspondientes al número de auditoría: ${numeroAuditoria}.

      Detalles de desviaciones:
      ${tableData.map(desviacion => `
      - Número de Requerimiento: ${desviacion.numeroRequerimiento}
      - Preguntas Auditadas: ${desviacion.preguntasAuditadas}
      - Criterio: ${desviacion.criterio}
      - Responsable: ${desviacion.responsable}
      - Establecimiento: ${desviacion.establecimiento}
      - Criticidad: ${desviacion.criticidad}
      - Acciones Correctivas: ${desviacion.accionesCorrectivas}
      - Fecha de Ingreso: ${desviacion.fechaIngreso}
      - Solución Programada: ${desviacion.fechaSolucionProgramada}
      - Estado: ${desviacion.estado}
      - Contacto Cliente: ${desviacion.contactoClientes}
      - Evidencia Fotográfica: ${desviacion.evidenciaFotografica}
      - Auditor: ${desviacion.auditor}
      - Correo: ${desviacion.correo}
      - Días Restantes: ${desviacion.diasRestantes}
      `).join('\n')}
      
      Para ver más detalles, haz clic en el siguiente enlace:
      https://frontend-svc7.onrender.com/
      `
    );

    console.log('Correo enviado exitosamente');
    return Promise.resolve("Email enviado exitosamente.");
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return Promise.reject(error);
  }
};


// Función simplificada para obtener solo el nivel de criticidad
export function obtenerNivelCriticidad(probabilidad: Probabilidad, consecuencia: Consecuencia): string {
  const puntaje = calcularPuntaje(probabilidad, consecuencia);
  const criticidad = determinarCriticidad(puntaje);
  
  return criticidad.nivel;
}





