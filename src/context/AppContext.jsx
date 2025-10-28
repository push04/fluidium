import React, { createContext, useContext, useReducer, useCallback } from 'react'

const initialState = {
  selectedExperiment: 'Bernoulli',
  parameters: {
    flowVelocity: 2,
    pipeHeight: 2,
    fluidDensity: 1000,
  },
  results: {},
  observationData: [],
  theme: localStorage.getItem('fluidium_theme') || 'light',
  sidebarOpen: true,
  simulationRunning: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EXPERIMENT':
      return {
        ...state,
        selectedExperiment: action.payload,
        parameters: {},
        results: {},
        observationData: [],
      }

    case 'UPDATE_PARAMS':
      return {
        ...state,
        parameters: { ...state.parameters, ...action.payload },
      }

    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
      }

    case 'ADD_OBSERVATION':
      return {
        ...state,
        observationData: [
          ...state.observationData,
          {
            timestamp: new Date().toISOString(),
            ...action.payload,
          },
        ],
      }

    case 'CLEAR_OBSERVATIONS':
      return {
        ...state,
        observationData: [],
      }

    case 'SET_THEME':
      localStorage.setItem('fluidium_theme', action.payload)
      return {
        ...state,
        theme: action.payload,
      }

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      }

    case 'SET_SIMULATION_RUNNING':
      return {
        ...state,
        simulationRunning: action.payload,
      }

    case 'RESET_EXPERIMENT':
      return {
        ...state,
        parameters: {},
        results: {},
        observationData: [],
      }

    default:
      return state
  }
}

export const AppContext = createContext()

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const updateParameters = useCallback((params) => {
    dispatch({ type: 'UPDATE_PARAMS', payload: params })
  }, [])

  const setResults = useCallback((results) => {
    dispatch({ type: 'SET_RESULTS', payload: results })
  }, [])

  const addObservation = useCallback((data) => {
    dispatch({ type: 'ADD_OBSERVATION', payload: data })
  }, [])

  const clearObservations = useCallback(() => {
    dispatch({ type: 'CLEAR_OBSERVATIONS' })
  }, [])

  const setExperiment = useCallback((experimentName) => {
    dispatch({ type: 'SET_EXPERIMENT', payload: experimentName })
  }, [])

  const setTheme = useCallback((theme) => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }, [])

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }, [])

  const setSimulationRunning = useCallback((running) => {
    dispatch({ type: 'SET_SIMULATION_RUNNING', payload: running })
  }, [])

  const resetExperiment = useCallback(() => {
    dispatch({ type: 'RESET_EXPERIMENT' })
  }, [])

  const value = {
    ...state,
    dispatch,
    updateParameters,
    setResults,
    addObservation,
    clearObservations,
    setExperiment,
    setTheme,
    toggleSidebar,
    setSimulationRunning,
    resetExperiment,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
