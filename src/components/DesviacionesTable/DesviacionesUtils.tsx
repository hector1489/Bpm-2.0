import { DesviacionResponse } from '../../interfaces/interfaces';
import { obtenerTodasLasAccionesDesdeAPI } from '../../utils/apiUtils';

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

export const getColorByPercentageFilas = (
  percentage: number,
  thresholds = { green: 90, yellow: 75 }
) => {
  if (percentage >= thresholds.green) return 'green';
  if (percentage >= thresholds.yellow) return 'yellow';
  return 'red';
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


