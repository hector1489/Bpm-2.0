import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import questions from '../questionsResponses.json';
import { IState, IContextProps, Answer } from '../interfaces/interfaces';

const AppContext = createContext<IContextProps | undefined>(undefined);

interface IAppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<IAppProviderProps> = ({ children }) => {
  const [state, setState] = useState<IState>({
    IsHero: [],
    auditSheetData: {}
  });

  useEffect(() => {
    const questionsWithId = questions.map((question, index) => ({
      id: index + 1,
      answer: "",
      ...question,
    }));

    setState({
      IsHero: questionsWithId,
      auditSheetData: {}
    });
  }, []);

  // Actualiza las respuestas de preguntas
  const addAnswers = (answers: Answer[]) => {
    const updatedQuestions = state.IsHero.map((question, index) => ({
      ...question,
      answer: answers[index]?.answer || question.answer
    }));

    setState((prevState) => ({
      ...prevState,
      IsHero: updatedQuestions,
    }));
  };

  // Actualiza los datos del formulario AuditSheet
  const updateAuditSheetData = (data: any) => {
    setState((prevState) => ({
      ...prevState,
      auditSheetData: { ...prevState.auditSheetData, ...data }
    }));
  };

  const contextValue = useMemo(
    () => ({ state, setState, addAnswers, updateAuditSheetData }),
    [state]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
