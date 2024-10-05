import { Dispatch, SetStateAction } from "react";

export interface IModule {
  id: number;
  module: string;
  question: string | string[];
}

export interface IQuestion {
  id: number;
  question: string;
  responses: string | string[];
  answer?: string;
}

export interface Answer {
  question: string;
  answer: string;
}

export interface IPhoto {
  question: string;
  photoUrl: string;
}

export interface IState {
  IsHero: Array<IQuestion>;
  auditSheetData: any;
  modules: IModule[];
  desviaciones?: Desviacion[];
  photos: IPhoto[];
  userName?: string;
  authToken: string | null;
}

export interface IContextProps {
  state: IState;
  setState: Dispatch<SetStateAction<IState>>;
  addAnswers: (answers: Answer[]) => void;
  updateAuditSheetData: (data: IAuditSheetData) => void;
  addDesviacion: (data: Desviacion) => void;
  addPhoto: (question: string, photoUrl: string) => void;
  removePhoto: (photoUrl: string) => void;
}

interface IAuditSheetData {
  nombreEstablecimiento: string;
  numeroAuditoria: string;
  gerenteEstablecimiento: string;
  administradorEstablecimiento: string;
  supervisorEstablecimiento: string;
  auditorEmail: string;
  fechaAuditoria: string;
  lum?: string;
}

export interface Desviacion {
  numeroRequerimiento: string;
  pregunta: string;
  respuesta: string;
  tipoDeAccion?: string;
  responsableDelProblema?: string;
  local?: string;
  criticidad?: string;
  accionesCorrectivas?: string;
  fechaRecepcionSolicitud?: string;
  fechaSolucionProgramada?: string;
  estado?: string;
  fechaCambioEstado?: string;
  contactoClientes?: string;
  evidenciaFotografica?: string;
  detalleFoto?: string;
  auditor?: string;
  correo?: string;
  fechaUltimaModificacion?: string;
}


// interfaces.ts
export interface DesviacionResponse {
  id: number;
  numero_requerimiento: string;
  preguntas_auditadas: string;
  desviacion_o_criterio: string;
  responsable_problema: string;
  local: string;
  criticidad: string;
  acciones_correctivas: string;
  fecha_recepcion_solicitud: string | null;
  fecha_solucion_programada: string | null;
  estado: string;
  fecha_cambio_estado: string | null;
  contacto_clientes: string;
  evidencia_fotografica: string;
  auditor: string;
  correo: string;
  detalle_foto: string;
  fecha_ultima_modificacion: string | null;
  tipo_de_accion: string;
}


