/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from 'redux';

interface Action {
  type: string;
  payload: any;
}

const initialState = {
  id: '',
  key: Math.random(),
  config: {},
  isReady: false,
  isSave: true,
  activeNavbar: '',
  collapse: false,
  services: [],
};

export type StateType = typeof initialState;
const RootReducers = (state = initialState, action: Action) => {
  const { type, ...payload } = action;
  switch (type) {
    case 'update:config':
      return {
        ...state,
        ...payload,
      };
    case 'update:data':
      return {
        ...state,
        ...payload,
      };
    case 'update:key':
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
};

const store = createStore(RootReducers);

export default store;
