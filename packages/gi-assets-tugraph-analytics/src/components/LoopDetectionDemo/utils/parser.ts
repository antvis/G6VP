export function parseLoopData(data: Set<string>) {
  const loops: string[][] = [];
  data.forEach((loop) => {
    const loopArr = loop.split(',');
    loops.push(loopArr);
  });
  return loops;
}

/**
 * @example
 * 节点
 * . 1,jim
 * . 2,tom
 * 边
 * - 1,2,0.2
 * 环路
 * 1,2,1
 */
export function parseGraphData(data: string) {
  if (typeof data !== 'string') return { nodes: [], edges: [], loops: [] };
  const lines = data.split('\n');
  const nodes: { id: string; name: string }[] = [];
  const edges: { source: string; target: string; weight: number }[] = [];
  const loops: string[][] = [];
  lines.forEach((line) => {
    const [type, val] = line.split(' ');
    if (type === '.') {
      const [id, name] = val.split(',');
      nodes.push({ id, name });
    } else if (type === '-') {
      const [source, target, weight] = val.split(',');
      edges.push({ source, target, weight: Number(weight) });
    } else {
      const loop = type.split(',');
      loops.push(loop);
    }
  });

  return { nodes, edges, loops };
}
