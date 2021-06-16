import demo from '../../mock/demo.json';
import enterprise from '../../mock/enterprise.json';
import liaoyuan from '../../mock/liaoyuan.json';

export const defaultData = {
  GIConfig: demo,
  knowledgeGraph: enterprise,
  riskControl: liaoyuan,
};

const GIDefaultTrans = `
data => {
  const nodes = data.nodes.map(n=>{
    return {
      id:n.id,
      data:n
    }
  })
  const edges = data.edges.map(e=>{
    return {
      source:e.source,
      target:e.target,
      data:e
    }
  })
  return { nodes, edges }
}
`;
const riskControlTrans = `
data => {
  const nodes = data.nodes.map(n=>{
    return {
      id:n.uri,
      data:n
    }
  })
  const edges = data.edges.map(e=>{
    return {
      source:e.fromNodeUri,
      target:e.toNodeUri,
      data:e
    }
  })
  return { nodes, edges }
}
`;

export const defaultTrans = {
  GIConfig: GIDefaultTrans,
  knowledgeGraph: GIDefaultTrans,
  riskControl: riskControlTrans,
};
