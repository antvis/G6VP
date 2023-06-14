import { isEqual } from '@antv/util';

export type LoopMsg = string[];

/**
 * 将当前 loop 检测结果和上一次的结果进行比较
 */
export function diffLoop(oldLoops: LoopMsg[], newLoops: LoopMsg[]) {
  const diff = {
    keep: [] as LoopMsg[],
    enter: [] as LoopMsg[],
    exit: [] as LoopMsg[],
  };
  newLoops.forEach(newLoop => {
    if (!oldLoops.some(oldLoop => isEqual(oldLoop, newLoop))) {
      diff.enter.push(newLoop);
    } else {
      diff.keep.push(newLoop);
    }
  });
  oldLoops.forEach(oldLoop => {
    if (!newLoops.some(newLoop => isEqual(oldLoop, newLoop))) {
      diff.exit.push(oldLoop);
    }
  });
  return diff;
}

export function loopToEdges(loop: LoopMsg) {
  const edges: [string, string][] = [];
  for (let i = 0; i < loop.length - 1; i++) {
    edges.push([loop[i], loop[i + 1]]);
  }
  edges.push([loop[loop.length - 1], loop[0]]);
  return edges;
}

export function loopsToEdges(loops: LoopMsg[]) {
  const edges: [string, string][] = [];
  loops.forEach(loop => {
    for (let i = 0; i < loop.length - 1; i++) {
      edges.push([loop[i], loop[i + 1]]);
    }
    edges.push([loop[loop.length - 1], loop[0]]);
  });
  return edges;
}
