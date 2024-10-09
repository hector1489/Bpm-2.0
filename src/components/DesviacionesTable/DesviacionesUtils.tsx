import { DesviacionResponse } from '../../interfaces/interfaces';
import { obtenerTodasLasAccionesDesdeAPI } from '../../utils/apiUtils';

const prioridades = [
  { valor: 'Leve', diasFechaSolucion: 45 },
  { valor: 'Moderado', diasFechaSolucion: 30 },
  { valor: 'Crítico', diasFechaSolucion: 15 }
];

export const calcularFechaSolucionProgramada = (fechaIngreso: string, criticidad: string): string => {
  const prioridad = prioridades.find(p => p.valor === criticidad);
  
  if (!prioridad) return fechaIngreso;

  const [dd, mm, yyyy] = fechaIngreso.split('/').map(Number);
  const fecha = new Date(yyyy, mm - 1, dd);

  fecha.setDate(fecha.getDate() + prioridad.diasFechaSolucion)

  const nuevaFecha = [
    String(fecha.getDate()).padStart(2, '0'),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    fecha.getFullYear()
  ].join('/');

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


export const crearSelectAcciones = async (authToken: string): Promise<HTMLSelectElement> => {
  const acciones = await obtenerTodasLasAccionesDesdeAPI(authToken);

  const accionesCorrectivas = acciones.flatMap((accionObj: { action: string }) => accionObj.action);
  const select = document.createElement('select');
  select.className = 'form-control';

  accionesCorrectivas.forEach((accion: string) => {
    const option = document.createElement('option');
    option.value = accion;
    option.text = accion;
    select.appendChild(option);
  });

  return select;
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


