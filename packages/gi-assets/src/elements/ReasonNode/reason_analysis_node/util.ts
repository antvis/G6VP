/* eslint-disable no-param-reassign  */

// 得到扇形的path
export function getFanPath(cfg: any) {
  const { cx, cy, rs, re, startAngle, endAngle, clockwise = true } = cfg;
  const flag1 = clockwise ? 1 : 0;
  const flag2 = clockwise ? 0 : 1;
  return [
    ['M', Math.cos(startAngle) * rs + cx, Math.sin(startAngle) * rs + cy],
    ['L', Math.cos(startAngle) * re + cx, Math.sin(startAngle) * re + cy],
    ['A', re, re, 0, 0, flag1, Math.cos(endAngle) * re + cx, Math.sin(endAngle) * re + cy],
    ['L', Math.cos(endAngle) * rs + cx, Math.sin(endAngle) * rs + cy],
    ['A', rs, rs, 0, 0, flag2, Math.cos(startAngle) * rs + cx, Math.sin(startAngle) * rs + cy],
    ['Z'],
  ];
}

type IValueSpace = {
  current: number;
  min: number;
  max: number;
};

type IMappingSpace = {
  min: number;
  max: number;
};

// 得到一个线性映射的值
export function getValueInRange_linear(valueSpace: IValueSpace, mappingSpace: IMappingSpace) {
  if (valueSpace.max === valueSpace.min) return valueSpace.current;

  return (
    mappingSpace.min +
    (valueSpace.current * (mappingSpace.max - mappingSpace.min)) / (valueSpace.max - valueSpace.min)
  );
}

// function getContainerBoundaryFunc(containerDomId: string = 'container') {
//   const container = document.getElementById(containerDomId);
//   if (!container) return () => ({ left: 0, top: 0 });
//   const { left = 0, top = 0 } = container.getClientRects()[0];
//   return () => {
//     return { left, top };
//   };
// }

// let getContaienrBoundary: (() => { left: number; top: number }) | undefined;

// 根据绝对位置，得到在容器中的位置
export function getClientRelativPoint(abs_x: number, abs_y: number) {
  // if (!getContaienrBoundary) {
  //   getContaienrBoundary = getContainerBoundaryFunc();
  // }
  // const { left = 0, top = 0 } = getContaienrBoundary?.();
  let left = 0,
    top = 0;
  const containerDomId: string = 'container';
  const container = document.getElementById(containerDomId);

  if (container) {
    left = container.getClientRects()[0].left;
    top = container.getClientRects()[0].top;
  }

  return {
    x: abs_x - left,
    y: abs_y - top,
  };
}


/**
 * 按照长度缩略文字
 * @param text 原始文字
 * @param limit 限制长度
 */
 export function ellipseText(text: string, limit: number) {
  const pre = text.slice(0, limit - 1);
  const mid = '...';
  const post = text[text.length - 1];
  return `${pre}${mid}${post}`;
}


interface ITree {
  children?: Array<ITree>;
  [props: string]: any;
}

/** 遍历树 DFS */
export const tree_dfs = <T extends ITree>(root: T, onVisit?: (item: T) => void) => {
  const stack: T[] = [root];
  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (onVisit && currentNode) {
      onVisit(currentNode);
    }
    currentNode?.children?.forEach((c: ITree) => {
      stack.push(c as T);
    });
  }
};

/** 遍历树 BFS */
export const tree_bfs = <T extends ITree>(root: T, onVisit?: (item: T) => void) => {
  const queue: T[] = [root];
  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (onVisit && currentNode) {
      onVisit(currentNode);
    }
    currentNode?.children?.forEach((c: ITree) => {
      queue.push(c as T);
    });
  }
};