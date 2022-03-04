export const rootActionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  ADD_ALERT: 'ADD_ALERT',
  REMOVE_ALERT: 'REMOVE_ALERT',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
};

const rootInitialState = {
  toasts: [],
  alerts: [],
  modal: {},
};

// ACTIONS
export const addToast = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.ADD_TOAST, payload });
};
export const removeToast = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.REMOVE_TOAST, payload });
};
export const addAlert = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.ADD_ALERT, payload });
};
export const removeAlert = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.REMOVE_ALERT, payload });
};
export const showModal = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SHOW_MODAL, payload });
};
export const hideModal = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.HIDE_MODAL, payload });
};

export default function reducer(state = rootInitialState, action) {
  switch (action.type) {
    case rootActionTypes.ADD_TOAST:
      return {...state, toasts: [action.payload, ...state.toasts]};
    case rootActionTypes.ADD_ALERT:
      return {...state, alerts: [action.payload, ...state.alerts]};
    case rootActionTypes.REMOVE_TOAST:
      return {...state, toasts: state.toasts.filter((item, index) => index !== action.payload)};
    case rootActionTypes.REMOVE_ALERT:
      return {...state, alerts: state.alerts.filter((item, index) => index !== action.payload)};
    case rootActionTypes.SHOW_MODAL:
      return {...state, modal: action.payload};
    case rootActionTypes.HIDE_MODAL:
      return {...state, modal: {}};
    default:
      return state;
  }
}