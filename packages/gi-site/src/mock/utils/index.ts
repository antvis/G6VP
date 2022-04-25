import faker from '@faker-js/faker';
import fs from 'fs';
console.log('fake data:', faker.name.findName());
//中国的经纬度范围大约为： 纬度3.86 53.55，经度73.66 135.05

const nodes = (count, type) => {
  return Array.from({ length: count }, (v, i) => {
    return {
      id: i,
      type,
      uid: faker.datatype.uuid(),
      /** 基本信息 */
      name: faker.name.findName(),
      age: faker.random.number({ min: 18, max: 60 }),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      company: faker.company.companyName(),
      avatar: faker.internet.avatar(),
      tags: [],
      group: faker.random.number({ min: 1, max: 4 }),
      /** 地理信息 */
      country: faker.address.country(),
      city: faker.address.city(),
      address: faker.address.streetAddress(),
      zip: faker.address.zipCode(),
      state: faker.address.state(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      /** 金融信息 */
      creditCardNumber: faker.finance.creditCardNumber('63[7-9]#-####-####-###L'),
      amount: Number(faker.finance.amount(1, 100000, 2, '')),
    };
  });
};

const edges = (count, type) => {
  return Array.from({ length: count }, (v, i) => {
    return {
      id: i,
      type,
      uid: faker.datatype.uuid(),
      /** 基本信息 */
      group: faker.random.number({ min: 1, max: 4 }),
      income: Number(faker.finance.amount(1, 100000, 2, '')),
      outcome: Number(faker.finance.amount(1, 100000, 2, '')),
    };
  });
};

console.log('nodes', nodes(10, 'user'));
const nodeCount = 50;

const schema = {
  nodes: [
    {
      nodeType: 'user',
      properties: {
        type: 'string',
        id: 'string',
        name: 'string',
        age: 'number',
      },
    },
    {
      nodeType: 'SSN',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
    {
      nodeType: 'phone',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
    {
      nodeType: 'email',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
    {
      nodeType: 'address',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
  ],
  edges: [
    {
      sourceNodeType: 'user',
      targetNodeType: 'email',
      edgeType: 'has',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
    {
      sourceNodeType: 'user',
      targetNodeType: 'email',
      edgeType: 'has',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
    {
      sourceNodeType: 'user',
      targetNodeType: 'phone',
      edgeType: 'has',
      properties: {
        type: 'string',
        id: 'string',
      },
    },
  ],
};

fs.writeFileSync('./finance/.json', JSON.stringify({ nodes, edges }, null, 2));
