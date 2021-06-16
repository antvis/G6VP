const fs = require('fs');
const data = require('./daxue');

const nodes = [];
const edges = [];
const walk = schema => {
  nodes.push(schema);
  if (schema.children && schema.children.length) {
    schema.children.forEach(child => {
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
