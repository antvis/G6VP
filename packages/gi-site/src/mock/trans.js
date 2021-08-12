const fs = require('fs');
const data = require('./daxue');

const nodes = [];
const edges = [];
const walk = schema => {
  //特殊处理根节点
  const isRoot = schema.id === '_id_0';
  if (isRoot) {
    schema.topic = '根节点';
  }
  nodes.push(schema);
  if (schema.children && schema.children.length) {
    schema.children.forEach(child => {
      if (isRoot) {
        child.topic = child.name;
      } else {
        child.topic = schema.topic;
      }
      console.log('child', child);
      edges.push({
        source: schema.id,
        target: child.id,
      });
      walk(child);
    });
  }
};
walk(data);

fs.writeFileSync('./daxue.json', JSON.stringify({ nodes, edges }, null, 2));
