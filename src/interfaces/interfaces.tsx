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

export interface IState {
  IsHero: Array<IQuestion>;
}

export interface IContextProps {
  state: IState;
  setState: Dispatch<SetStateAction<IState>>;
}
