/* eslint-disable @typescript-eslint/no-explicit-any */
import Lockr from 'lockr';
import { createStore } from 'redux';

interface Action {
  type: string;
  payload: any;
}

const project = Lockr.get('project');

const initialState = {
  config: {
    components: [
      {
        id: 'Legend',
        meta: {},
        props: {},
        enable: true,
      },
    ],
    node: [
      {
        id: 'graphin-node',
        enable: true,
        /** style.keyshape.color */
        color: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 'red',
            enable: false,
          },
        ],
        /** style.keyshape.size */
        size: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: [40, 20, 30, 20, 10],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 30,
            enable: false,
          },
        ],
        /** style.label */
        label: {
          key: 'id',
        },
      },
    ],
    edge: [
      {
        id: 'graphin-edge',
        /** style.keyshape.stroke */
        color: {
          key: 'type',
          enum: ['red', 'blue', 'green', 'yellow'],
        },
        /** style.keyshape.size */
        size: {
          key: 'weight',
        },
        /** style.label */
        label: {
          key: 'id',
        },
      },
    ],
    layout: {
      id: 'graphin-force',
      options: {
        animation: false,
        preset: {
          type: 'concentric',
        },
      },
    },
  },
};

const RootReducers = (state = initialState, action: Action) => {
  const { type, ...payload } = action;
  switch (type) {
    case 'Update:Config':
      return {
        ...state,
        ...payload,
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
