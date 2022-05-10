const faker = require('@faker-js/faker').default;
/** 数据去重 */
const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);

const data1 = {
  nodes: [
    {
      id: '6217****1',
      type: 'card',
      tag: '警方备案，涉黑卡号',
    },
    {
      id: '2088xxx1',
      type: 'alipay',
    },
    {
      id: '2088xxx2',
      type: 'alipay',
    },
    {
      id: '2088xxx0',
      type: 'alipay',
      onwer: '王xx',
      is1688: true,
    },
  ],
  edges: [
    {
      source: '6217****1',
      target: '2088xxx1',
      amount: 50000,
      type: 'transfer',
    },
    {
      source: '2088xxx1',
      target: '2088xxx2',
      amount: 10000,
      type: 'transfer',
    },
    {
      source: '2088xxx2',
      target: '2088xxx0',
      amount: 10000,
      type: 'transfer',
    },
  ],
};

const generate = count => {
  const nodes = [];
  const edges = [];
  Array.from({ length: count }).forEach(() => {
    const nodeId = faker.name.lastName();

    const node = {
      id: nodeId,
      type: 'alipay',
      alipayNo: faker.finance.creditCardNumber('6666#-####'),
    };

    nodes.push(node);
    const edge = [
      {
        source: nodeId,
        target: '2088xxx0',
        amount: 100,
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

const data3 = {
  nodes: [
    {
      id: '李xx',
      type: 'alipay',
      alipayNo: '2088xxxxx1',
      tag: '体系内涉黑:2021-09-02,LINK:https://www.xxxx.com',
    },
    {
      id: '张xx',
      type: 'alipay',
      alipayNo: '2088xxxxx2',
    },
  ],
  edges: [
    {
      source: '李xx',
      target: '张xx',
      amount: 50000,
      type: 'transfer',
    },
    {
      source: '张xx',
      target: '2088xxx0',
      amount: 100,
      type: 'transfer',
    },
  ],
};

const data4 = {
  nodes: [
    {
      id: '营业执照xxxx',
      type: 'YYZZ',
    },
    {
      id: 'xxxx某',
      type: 'alipay',
      alipayNo: '2088xxxxxxx1',
      longitude: Number(faker.address.longitude(102.5, 102)),
      latitude: Number(faker.address.latitude(25.5, 25)),
    },
    {
      id: '娱乐xx春花秋月公司',
      type: 'company',
      longitude: Number(faker.address.longitude(102.5, 102)),
      latitude: Number(faker.address.latitude(25.5, 25)),
    },
    {
      id: '娱乐xx天上人间公司',
      type: 'company',
      longitude: Number(faker.address.longitude(102.5, 102)),
      latitude: Number(faker.address.latitude(25.5, 25)),
    },
  ],
  edges: [
    {
      source: '2088xxx0',
      target: '营业执照xxxx',
      type: 'owner',
    },
    {
      source: '营业执照xxxx',
      target: 'xxxx某',
      type: 'faren',
    },
    {
      source: 'xxxx某',
      target: '娱乐xx春花秋月公司',
      type: 'owner',
    },
    {
      source: 'xxxx某',
      target: '娱乐xx天上人间公司',
      type: 'owner',
    },
  ],
};

const nodes = uniqueElementsBy([...data1.nodes, ...data2.nodes, ...data3.nodes, ...data4.nodes], (a, b) => {
  return a.id === b.id;
});
const edges = [...data1.edges, ...data2.edges, ...data3.edges, ...data4.edges];

const fs = require('fs');
fs.writeFileSync(
  './v1.2.json',
  JSON.stringify(
    {
      nodes,
      edges,
    },
    null,
    2,
  ),
);
