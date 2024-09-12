import { createContext, ReactNode, useState, Dispatch, SetStateAction, useMemo, useEffect } from "react";
import questions from '../questions.json';

interface IQuestion {
  id: number;
  module: string;
  question: string | string[];
}

interface IState {
  IsHero: Array<IQuestion>;
}

interface IContextProps {
  state: IState;
  setState: Dispatch<SetStateAction<IState>>;
  removeFromCart: (itemId: number) => void;
}

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
      ...question,
    }));

    setState({
      IsHero: questionsWithId,
    });
  }, []);

  const removeFromCart = (itemId: number) => {
    setState(prevState => ({
      ...prevState,
      IsHero: prevState.IsHero.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: 0,
          };
        }
        return item;
      }),
    }));
  };

  const contextValue = useMemo(() => ({ state, setState, removeFromCart }), [state]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
