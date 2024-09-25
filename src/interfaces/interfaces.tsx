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





