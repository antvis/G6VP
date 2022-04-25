const path = require('path');
const fs = require('fs');
const csv = require('@fast-csv/format');
const faker = require('@faker-js/faker').default;

//中国的经纬度范围大约为： 纬度3.86 53.55，经度73.66 135.05
const nodeType = ['user', 'customer', 'supplier'];
const genNodes = (count, type) => {
  return Array.from({ length: count }, (v, i) => {
    const count = Math.floor(Math.random() * 4); //每个节点与其他节点的链接不超过 10 个
    return {
      id: i,
      type: nodeType[count],
      uid: faker.datatype.uuid(),
      /** 基本信息 */
      name: faker.name.findName(),
      age: faker.datatype.number({ min: 18, max: 60 }),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      company: faker.company.companyName(),
      avatar: faker.internet.avatar(),
      tags: [],
      group: faker.datatype.number({ min: 1, max: 4 }),
      /** 地理信息 */
      country: faker.address.country(),
      city: faker.address.city(),
      address: faker.address.streetAddress(),
      zip: faker.address.zipCode(),
      state: faker.address.state(),
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
      /** 金融信息 */
      creditCardNumber: faker.finance.creditCardNumber('63[7-9]#-####-####-###L'),
      amount: Number(faker.finance.amount(1, 100000, 2, '')),
    };
  });
};

class CsvFile {
  static write(filestream, rows, options) {
    return new Promise((res, rej) => {
      csv
        .writeToStream(filestream, rows, options)
        .on('error', err => rej(err))
        .on('finish', () => res());
    });
  }

  constructor(opts) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.writeOpts = { headers: this.headers, includeEndRowDelimiter: true };
  }

  create(rows) {
    return CsvFile.write(fs.createWriteStream(this.path), rows, { ...this.writeOpts });
  }

  append(rows) {
    return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
      ...this.writeOpts,
      // dont write the headers when appending
      writeHeaders: false,
    });
  }

  read() {
    return new Promise((res, rej) => {
      fs.readFile(this.path, (err, contents) => {
        if (err) {
          return rej(err);
        }
        return res(contents);
      });
    });
  }
}

const nodeCount = 100;
const nodes = genNodes(nodeCount, 'user');
const edgeType = ['follow', 'friend', 'employee', 'family'];
const edges = nodes
  .map((node, index) => {
    const linkCount = Math.floor(Math.random() * 3); //每个节点与其他节点的链接不超过 10 个
    console.log('linkCount', linkCount);
    const links = Array.from({ length: linkCount }, (v, i) => {
      const link = {
        source: index,
        target: Math.floor(Math.random() * nodeCount),
        type: edgeType[linkCount],
      };
      return link;
    });
    return links;
  })
  .reduce((acc, curr) => {
    return [...acc, ...curr];
  });
console.log('edges', edges);

fs.writeFileSync('../json/user-network.json', JSON.stringify({ nodes, edges }, null, 2));

const csvNodesFile = new CsvFile({
  path: path.resolve(__dirname, '../csv/graphscope-nodes.csv'),
  // headers to write
  headers: true,
});
// 1. create the csv
csvNodesFile
  .create(nodes)
  .then(() => csvNodesFile.read())
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });

const csvEdgesFile = new CsvFile({
  path: path.resolve(__dirname, '../csv/graphscope-edges.csv'),
  // headers to write
  headers: true,
});
// 1. create the csv
csvEdgesFile
  .create(edges)
  .then(() => csvEdgesFile.read())
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
