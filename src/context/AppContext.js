import React, { createContext, useReducer } from 'react';
import ACTION_TYPES from '../constants/ActionTypes';
const AppContext = createContext();

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  responses: {},
};

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_QUESTIONS:
      return { ...state, questions: action.payload };
    case ACTION_TYPES.SET_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.index]: action.payload.response,
        },
      };
    case ACTION_TYPES.SET_PROGRESS:
      return { ...state, currentQuestionIndex: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
