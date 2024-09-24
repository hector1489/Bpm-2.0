import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import modulesData from '../questions.json';
import questions from '../questionsResponses.json';
import { IState, IContextProps, Answer, IModule, Desviacion } from '../interfaces/interfaces';

const transformModules = (modulesData: any[]): IModule[] => {
  return modulesData.map((moduleData, index) => ({
    id: index + 1,
    module: moduleData.module,
    question: moduleData.question
  }));
};

const AppContext = createContext<IContextProps | undefined>(undefined);

interface IAppProviderProps {
  children: ReactNode;
}

const saveStateToLocalStorage = (state: IState) => {
  localStorage.setItem("appState", JSON.stringify(state));
}

const loadStateFromLocalStorage = (): IState | null => {
  const state = localStorage.getItem("appState");
  return state ? JSON.parse(state) : null;
}

const AppProvider: React.FC<IAppProviderProps> = ({ children }) => {
  const [state, setState] = useState<IState>(loadStateFromLocalStorage() || {
    IsHero: [],
    auditSheetData: {},
    modules: transformModules(modulesData),
    desviaciones: [],
    photos: []
  });

  useEffect(() => {
    if (!state.IsHero.length) {
      const questionsWithId = questions.map((question, index) => ({
        id: index + 1,
        answer: "",
        ...question,
      }));

      setState(prevState => ({
        ...prevState,
        IsHero: questionsWithId
      }));
    }
  }, [state.IsHero.length]);

  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state]);

  const addAnswers = (answers: Answer[]) => {
    const updatedQuestions = state.IsHero.map((question, index) => ({
      ...question,
      answer: answers[index]?.answer || question.answer
    }));

    setState(prevState => ({
      ...prevState,
      IsHero: updatedQuestions,
    }));
  }

  const updateAuditSheetData = (data: any) => {
    setState(prevState => ({
      ...prevState,
      auditSheetData: { ...prevState.auditSheetData, ...data }
    }));
  }

  const addDesviacion = (data: Desviacion) => {
    setState(prevState => ({
      ...prevState,
      desviaciones: [...(prevState.desviaciones || []), data]
    }));
  };

  const addPhoto = (question: string, photoUrl: string) => {

    if (!Array.isArray(state.photos)) {
      state.photos = [];
    }
  
    const updatedPhotos = [...state.photos, { question, photoUrl }];
    setState(prevState => ({
      ...prevState,
      photos: updatedPhotos,
    }));
    console.log("Fotos actualizadas:", updatedPhotos);
  };

  const removePhoto = (photoUrl: string) => {
    const updatedPhotos = state.photos.filter(photo => photo.photoUrl !== photoUrl);
  
    setState(prevState => ({
      ...prevState,
      photos: updatedPhotos,
    }));
  };

  
  const contextValue = useMemo(
    () => ({ state, setState, addAnswers, updateAuditSheetData, addDesviacion, addPhoto, removePhoto }),
    [state]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
