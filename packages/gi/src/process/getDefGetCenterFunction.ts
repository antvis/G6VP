import { Graph } from '@antv/graphin';
export const getDefGetCenterFunction = (
  income: string,
  outcome: string,
  isLog: string,
  multiple: string,
  graph: Graph,
) => {
  const height = graph.getHeight();

  const getCenter = node => {
    let strength = 0;
    let centerX = 0;
    let centerY = 0;

    try {
      if (!node) {
        return [0, 0, 0];
      }
      const { data, x, y } = node;
      let value = data[income] - data[outcome];

      centerX = x;
      centerY = value > 0 ? height : 0;

      if (isLog) {
        value = (value / Math.abs(value)) * Math.log(Math.abs(value));
      }
      value = value * parseFloat(multiple);

      strength = Math.abs(value);
    } catch (e) {
      console.log(e);
    }

    //console.log(centerX, centerY, strength);

    return [centerX, centerY, strength];
  };
  return getCenter;
};
