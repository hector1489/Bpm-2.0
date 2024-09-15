import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import questions from '../questionsResponses.json';
import { IState, IContextProps } from '../interfaces/interfaces';

const AppContext = createContext<IContextProps | undefined>(undefined);

interface IAppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<IAppProviderProps> = ({ children }) => {
  const [state, setState] = useState<IState>({
    IsHero: [],
  });

  useEffect(() => {
    const questionsWithId = questions.map((question, index) => ({
      id: index + 1,
      answer: "",
      ...question,
    }));

    setState({
      IsHero: questionsWithId,
    });
  }, []);

  const contextValue = useMemo(() => ({ state, setState }), [state]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
