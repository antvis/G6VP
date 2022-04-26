const faker = require('@faker-js/faker').default;
/** 数据去重 */
const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);

const data = {
  nodes: [
    {
      id: '6217****1',
      type: 'bank',
      tag: 'black',
    },
    {
      id: '*剑剑',
      type: 'alipay',
    },
    {
      id: '66666****2',
      type: 'wangshang',
      owner: '*剑剑',
    },
  ],
  edges: [
    {
      source: '6217****1',
      target: '*剑剑',
      amount: 800000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
    {
      source: '*剑剑',
      target: '66666****2',
      amount: 100000,
      type: 'transfer',
    },
  ],
};

const generate = count => {
  const nodes = [];
  const edges = [];
  Array.from({ length: count }).forEach(() => {
    const nodeId = faker.name.lastName();
    const cardId = faker.finance.creditCardNumber('2088#-####');
    const node = {
      id: nodeId,
      type: 'alipay',
      alipayNo: faker.finance.creditCardNumber('6666#-####'),
    };
    const card = {
      id: cardId,
      type: 'bank',
      owner: nodeId,
      longitude: Number(faker.address.longitude(102.5, 102)),
      latitude: Number(faker.address.latitude(25.5, 25)),
      /** 金融信息 */
    };
    nodes.push(node, card);
    const edge = [
      {
        source: '66666****2',
        target: nodeId,
        amount: Math.floor(Math.random() * (800000 / count) + 1000),
        type: 'transfer',
      },
      {
        source: nodeId,
        target: cardId,
        amount: Math.floor(Math.random() * (100000 / count) + 400),
        type: 'transfer',
      },
    ];
    edges.push(...edge);
  });
  return {
    nodes,
    edges,
  };
};
const data2 = generate(6);
const nodes = uniqueElementsBy([...data.nodes, ...data2.nodes], (a, b) => {
  return a.id === b.id;
});
const edges = [...data.edges, ...data2.edges];

const fs = require('fs');
fs.writeFileSync(
  './v1.1.json',
  JSON.stringify(
    {
      nodes,
      edges,
    },
    null,
    2,
  ),
);
