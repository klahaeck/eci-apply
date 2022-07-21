import { createContext, useContext, useReducer } from 'react';

export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';
export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const CLEAR_ALERTS = 'CLEAR_ALERTS';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

const rootReducer = (state, action) => {
  switch(action.type) {
    case ADD_TOAST:
      return { ...state, toasts: [ ...state.toasts, action.payload ] };
    case REMOVE_TOAST:
      return { ...state, toasts: state.toasts.splice(action.payload, 1) };
    case ADD_ALERT:
      return { ...state, alerts: [ ...state.alerts, action.payload ] };
    case REMOVE_ALERT:
      return { ...state, alerts: state.alerts.filter(alert => alert.position !== action.payload.position).splice(action.payload.index, 1) };
    case CLEAR_ALERTS:
      return { ...state, alerts: state.alerts.filter(alert => alert.position !== action.payload) };
    case SHOW_MODAL:
      return { ...state, modal: action.payload };
    case HIDE_MODAL:
      return { ...state, modal: {} };
    default:
      return state;
  }
};

export const RootContext = createContext();

export const useRoot = () => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useRoot must be used within a RootProvider');
  }

  return context;
}

export const RootProvider = ({ children }) => {
  const initialState = {
    toasts: [],
    alerts: [],
    modal: {},
  };

  const [ state, dispatch ] = useReducer(rootReducer, initialState);

  const addToast = (toast) => dispatch({ type: ADD_TOAST, payload: toast });
  const removeToast = (toast) => dispatch({ type: REMOVE_TOAST, payload: toast });
  const addAlert = (alert) => dispatch({ type: ADD_ALERT, payload: alert });
  const removeAlert = (index) => dispatch({ type: REMOVE_ALERT, payload: index });
  const clearAlerts = (position) => dispatch({ type: CLEAR_ALERTS, payload: position });
  const showModal = (modal) => dispatch({ type: SHOW_MODAL, payload: modal });
  const hideModal = () => dispatch({ type: HIDE_MODAL });
  const openForm = (header, body, size, fullscreen) => showModal({size, header, body, fullscreen});
  
  const methods = { addToast, removeToast, addAlert, removeAlert, clearAlerts, showModal, hideModal, openForm };

  return <RootContext.Provider value={{ ...state,  ...methods }}>{children}</RootContext.Provider>;
}