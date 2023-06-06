export const LOOP_EDGE_STYLE = {
  keyshape: {
    hasArrow: true,
    customPoly: false,
    lineDash: [4, 4],
    opacity: 1,
    stroke: '#ddd',
  },
  animate: {
    visible: true,
    type: 'line-dash',
    repeat: true,
    duration: 8000,
  },
};

export const ENTER_LOOP_EDGE_STYLE = {
  keyshape: {
    hasArrow: true,
    customPoly: false,
    lineDash: [4, 4],
    opacity: 1,
    stroke: 'rgba(245,166,35,1)',
  },
  animate: {
    visible: true,
    type: 'circle-running',
    dotColor: 'red',
    repeat: true,
    duration: 3000,
  },
};

export const BASE_NODES_DATA = `. 1,jim
. 2,kate
. 3,lily
. 4,lucy
. 5,brown
. 6,jack
. 7,jackson`;

export const BASE_EDGES_DATA = `- 1,2,0.2
- 2,3,0.3
- 3,4,0.2
- 4,1,0.1
- 4,5,0.1
- 5,1,0.2
- 5,6,0.1
- 6,7,0.1`;

export const PALETTES = {
  normal: [
    'orange',
    'magenta',
    'lime',
    'yellow',
    'red',
    'green',
    'volcano',
    'geekblue',
    'pink',
    'cyan',
  ],
  candies: [
    'rgb(251, 180, 174)',
    'rgb(179, 205, 227)',
    'rgb(204, 235, 197)',
    'rgb(222, 203, 228)',
    'rgb(254, 217, 166)',
    'rgb(255, 255, 204)',
    'rgb(229, 216, 189)',
    'rgb(253, 218, 236)',
    'rgb(242, 242, 242)',
  ],
};
