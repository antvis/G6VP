const fs = require('fs');
const data = require('./test.json');

const nodes = [];
const edges = data.edges;
data.nodes.map(d => {
  nodes.push({
    id: d.id,
    cord: [d.lon, d.lat],
  });
});

fs.writeFileSync('./result.json', JSON.stringify({ nodes, edges }, null, 2));