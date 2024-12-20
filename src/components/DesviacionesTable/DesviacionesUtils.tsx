import { DesviacionResponse } from '../../interfaces/interfaces';
import { obtenerTodasLasAccionesDesdeAPI } from '../../utils/apiUtils';
import { getCurrentDate } from '../../utils/utils';
import { sendEmail, sendEmailWithExcel } from '../../utils/apiUtils';
import html2canvas from 'html2canvas';
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

  const [yyyy, mm, dd] = fechaIngreso.split('-').map(Number);
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) {
    console.error('Fecha de ingreso inválida:', fechaIngreso);
    return fechaIngreso;
  }

  const fecha = new Date(yyyy, mm - 1, dd);
  fecha.setDate(fecha.getDate() + prioridad.diasFechaSolucion);

  const solucionFecha = [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0')
  ].join('-');

  return solucionFecha;
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

export const extractPrefixForTRA = (field3: string): string => {
  const match = field3.match(/^TRA [A-Z]+ \d+/);
  return match ? match[0] : '';
};

export const extractPrefixForCIS = (field3: string): string => {
  const match = field3.match(/^CIS\s?\d+/);
  return match ? match[0] : '';
};

export const extractPrefixForELB = (field3: string): string => {
  const match = field3.match(/^ELB \d+/);
  return match ? match[0] : '';
};



export const crearSelectAcciones = async (authToken: string, preguntaAuditada: string): Promise<HTMLSelectElement> => {
  try {
    const acciones = await obtenerTodasLasAccionesDesdeAPI(authToken);
    const obtenerPrefijo = (pregunta: string): string => {
      const prefijoTRA = extractPrefixForTRA(pregunta);
      if (prefijoTRA) {
        return prefijoTRA.toLowerCase();
      }
    
      const prefijoCIS = extractPrefixForCIS(pregunta);
      if (prefijoCIS) {
        return prefijoCIS.toLowerCase();
      }
    
      const prefijoELB = extractPrefixForELB(pregunta);
      if (prefijoELB) {
        return prefijoELB.toLowerCase();
      }
    
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

export const handleScreenshotTableDesviaciones = async () => {
  const table = document.getElementById('tabla-desviaciones') as HTMLElement;

  html2canvas(table, {
    scale: 2,
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = 'desviaciones_tabla.png';
    link.href = imgData;
    link.click();
  });
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

      - Número de Requerimiento:    ${desviacion.numeroRequerimiento}
      - Preguntas Auditadas:         ${desviacion.preguntasAuditadas}
      - Criterio:                              ${desviacion.criterio}
      - Responsable:                        ${desviacion.responsable}
      - Establecimiento:                ${desviacion.establecimiento}
      - Criticidad:                          ${desviacion.criticidad}
      - Acciones Correctivas:       ${desviacion.accionesCorrectivas}
      - Fecha de Ingreso:                  ${desviacion.fechaIngreso}
      - Solución Programada:    ${desviacion.fechaSolucionProgramada}
      - Estado:                                  ${desviacion.estado}
      - Contacto Cliente:              ${desviacion.contactoClientes}
      - Evidencia Fotográfica:     ${desviacion.evidenciaFotografica}
      - Auditor:                                ${desviacion.auditor}
      - Correo:                                  ${desviacion.correo}
      - Días Restantes:                   ${desviacion.diasRestantes}
      _______________________________________________________________
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

const DEFAULT_ANSWER = "Sin respuesta";

export const desviacionesSendEmail = (localDesviaciones: DesviacionResponse[], emailDestino: string) => {
    
  if (localDesviaciones.length === 0) {
    alert("No hay desviaciones para enviar.");
    return;
  }

  const email = emailDestino || localDesviaciones[0].correo || DEFAULT_ANSWER;
  const numeroAuditoria = localDesviaciones[0].numero_requerimiento || DEFAULT_ANSWER;

  // Encabezados de la tabla (puedes personalizarlos si es necesario)
  const headers = [
    'Numero Requerimiento', 'Preguntas Auditadas', 'Criterio', 'Responsable',
    'Establecimiento', 'Criticidad', 'Acciones Correctivas', 'Fecha Ingreso',
    'Fecha Solución Programada', 'Estado', 'Contacto Clientes',
    'Evidencia Fotográfica', 'Auditor', 'Correo', 'Días Restantes'
  ];

  // Convertir los datos a un formato bidimensional
  const tableData = localDesviaciones.map(desviacion => [
    desviacion.numero_requerimiento || DEFAULT_ANSWER,
    desviacion.preguntas_auditadas || DEFAULT_ANSWER,
    desviacion.desviacion_o_criterio || DEFAULT_ANSWER,
    desviacion.responsable_problema || DEFAULT_ANSWER,
    desviacion.local || DEFAULT_ANSWER,
    desviacion.criticidad || DEFAULT_ANSWER,
    desviacion.acciones_correctivas || DEFAULT_ANSWER,
    desviacion.fecha_recepcion_solicitud || DEFAULT_ANSWER,
    desviacion.fecha_solucion_programada || DEFAULT_ANSWER,
    desviacion.estado || DEFAULT_ANSWER,
    desviacion.contacto_clientes || DEFAULT_ANSWER,
    desviacion.evidencia_fotografica || DEFAULT_ANSWER,
    desviacion.auditor || DEFAULT_ANSWER,
    desviacion.correo || DEFAULT_ANSWER,
    calcularDiasRestantes(desviacion.fecha_recepcion_solicitud || DEFAULT_ANSWER, desviacion.criticidad || DEFAULT_ANSWER).toString(),
  ]);

  // Agregar los encabezados a los datos (opcional, si quieres que la tabla tenga una fila de encabezado)
  const finalTableData = [headers, ...tableData];

  // Asignar el asunto y el texto del correo
  const subject = `Reporte de Desviaciones - ${numeroAuditoria}`;
  const text = `Se adjunta el reporte de desviaciones correspondiente a la auditoría ${numeroAuditoria}.`;

  // Llamar a la función que envía el correo
  sendEmailWithExcel(email, subject, text, finalTableData)
    .then(() => alert("Email enviado exitosamente."))
    .catch(error => {
      console.error('Error al enviar el email:', error);
      alert('Hubo un error al enviar el email. Por favor, inténtalo de nuevo.');
    });
};



