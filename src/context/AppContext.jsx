import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  selectedExperiment: "Bernoulli",
  parameters: {},
  results: {},
  theme: "light",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_EXPERIMENT":
      return { ...state, selectedExperiment: action.payload };
    case "UPDATE_PARAMS":
      return { ...state, parameters: { ...state.parameters, ...action.payload } };
    case "SET_RESULTS":
      return { ...state, results: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
