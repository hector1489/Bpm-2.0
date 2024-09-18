import { createContext, ReactNode, useState, useMemo, useEffect } from "react"
import questions from '../questionsResponses.json'
import { IState, IContextProps, Answer } from '../interfaces/interfaces'

const AppContext = createContext<IContextProps | undefined>(undefined)

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
  const initialState: IState = {
    IsHero: [],
    auditSheetData: {}
  }

  const [state, setState] = useState<IState>(loadStateFromLocalStorage() || initialState)

  useEffect(() => {
    if (!state.IsHero.length) {
      const questionsWithId = questions.map((question, index) => ({
        id: index + 1,
        answer: "",
        ...question,
      }));

      setState((prevState) => ({
        ...prevState,
        IsHero: questionsWithId,
        auditSheetData: prevState.auditSheetData
      }));
    }
  }, [state.IsHero.length])

  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state])

  const addAnswers = (answers: Answer[]) => {
    const updatedQuestions = state.IsHero.map((question, index) => ({
      ...question,
      answer: answers[index]?.answer || question.answer
    }));

    setState((prevState) => ({
      ...prevState,
      IsHero: updatedQuestions,
    }));
  }

  const updateAuditSheetData = (data: any) => {
    setState((prevState) => ({
      ...prevState,
      auditSheetData: { ...prevState.auditSheetData, ...data }
    }));
  }

  const contextValue = useMemo(
    () => ({ state, setState, addAnswers, updateAuditSheetData }),
    [state]
  )

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider, AppContext }
