/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from 'redux';
interface Action {
  type: string;
  payload: any;
}

const initialState = {
  data: { nodes: [], edges: [] },
  layout: {
    type: 'concentric',
    options: {},
  },
  tooltip: {
    placement: 'top',
    visible: true,
    hasArrow: true,
    keys: ['id'],
  },
  allKeys: ['id', 'type'],
};

const RootReducers = (state = initialState, action: Action) => {
  const { type, ...payload } = action;
  switch (type) {
    case 'Update_Data':
      const allKeys = Object.keys(payload.data.nodes[0]);
      return {
        ...state,
        ...payload,
        allKeys,
      };
    case 'Update_Layout':
      return {
        ...state,
        ...payload,
      };
    case 'Update_Tooltip':
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
