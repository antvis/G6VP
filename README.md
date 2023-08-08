<p align="center">
  <a href="https://insight.antv.antgroup.com">
    <img width="100" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*JWHaT5RS95YAAAAAAAAAAAAADmJ7AQ/original">
  </a>
</p>

<div align="center">
  
[![Version](https://badgen.net/npm/v/@antv/gi-sdk)](https://www.npmjs.com/@antv/gi-sdk)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/gi-sdk.svg)](http://npmjs.com/@antv/gi-sdk)
![Latest commit](https://badgen.net/github/last-commit/antvis/graphinsight)
  
</div>

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> English | [简体中文](/docs/README.zh-CN.md)

G6VP takes its name from AntV G6 Visualization Platform and was formerly known as `AntV/GraphInsight`. It is an online visual analysis tool for graphs and a low-code tool for building graph applications.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/160133/1688104661122-01363aae-3c84-43e6-b567-dc54ba252050.png#averageHue=%238e9454&clientId=u60d9995f-114f-4&from=paste&height=600&id=ud6ecf3e5&originHeight=1200&originWidth=2307&originalType=binary&ratio=2&rotation=0&showTitle=false&size=666895&status=done&style=none&taskId=u58943983-4eef-4701-bc58-d40e3285928&title=&width=1153.5)

## 01 Quick Start

- Site: [https://insight.antv.antgroup.com](https://insight.antv.antgroup.com)
- Documentation: [https://www.yuque.com/antv/gi](https://www.yuque.com/antv/gi)

### 1.1 Create a Dataset

Before analyzing data, we need to create a dataset. The dataset can be a local JSON, CSV, XLSX file, or a graph database, such as TuGraph, GraphScope, HugeGraph, Galaxybase,JanusGraph and Neo4j. It may also be a user-defined service, as shown below, where we choose a TuGraph database as the dataset.
![image.png](https://cdn.nlark.com/yuque/0/2023/png/160133/1688103977340-80b5d9d4-4a79-461f-a7cc-a41789f76f65.png#averageHue=%23c4cf8d&clientId=u60d9995f-114f-4&from=paste&height=663&id=ud5c13f4d&originHeight=1325&originWidth=1842&originalType=binary&ratio=2&rotation=0&showTitle=false&size=424226&status=done&style=none&taskId=ud0fcc594-09db-48dd-85c0-396bedcdbfc&title=&width=921)

### 1.2 Create a Workbook

With the data, we can create an analysis canvas. When creating a canvas, we can choose different templates. The template may come from an asset package or it may be manually saved or selected from an asset inventory.
![image.png](https://cdn.nlark.com/yuque/0/2023/png/160133/1688104027896-4d91259f-defd-4cfc-9e70-3dd84af3fde5.png#averageHue=%23e2e9f8&clientId=u60d9995f-114f-4&from=paste&height=401&id=uca1fc127&originHeight=802&originWidth=1828&originalType=binary&ratio=2&rotation=0&showTitle=false&size=568240&status=done&style=none&taskId=udaee6967-b101-4798-85cb-4e3d099ba26&title=&width=914)

### 1.3 Configure the Canvas

After entering the canvas, we can use the "Style" and "Layout" in the sidebar to map the visual representation of the canvas. At the same time, the entire canvas application, and the entire graph analysis capability, can be configured in the "Components" navigation panel. Components can be assembled like building blocks.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/160133/1688104130268-dae75ac4-0110-482e-bcc1-8c9d771ac5c6.png#averageHue=%23ead37f&clientId=u60d9995f-114f-4&from=paste&height=513&id=ud9b12ddc&originHeight=1026&originWidth=1853&originalType=binary&ratio=2&rotation=0&showTitle=false&size=464906&status=done&style=none&taskId=u3e0f3c65-b31a-489e-87a3-18e21030cba&title=&width=926.5)

### 1.4 Remember to Save Timely

Remember to click the "Save" button in the upper right corner in a timely manner. This way, the configuration information of the canvas will be saved, and it can be analyzed directly next time.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/160133/1688104156548-a2127580-0eff-4678-8ac0-dbc29d9e6266.png#averageHue=%23e8f1d3&clientId=u60d9995f-114f-4&from=paste&height=258&id=u410361c8&originHeight=516&originWidth=1826&originalType=binary&ratio=2&rotation=0&showTitle=false&size=363844&status=done&style=none&taskId=u2f892e48-f42a-45d2-8ba7-ee891fbd3bb&title=&width=913)

### 1.5 Export SDK

For friends in need of development, you can click the "Export" button in the upper right corner of the canvas to export the source code of the canvas. Currently, HTML, CDN, and NPM export methods are supported, which facilitates developers to carry out secondary development and independent deployment.

![image.png](https://cdn.nlark.com/yuque/0/2023/png/160133/1688104181544-c66c4cce-03b0-4421-990a-793a7f27b063.png#averageHue=%232f342c&clientId=u60d9995f-114f-4&from=paste&height=413&id=u679d3823&originHeight=825&originWidth=1835&originalType=binary&ratio=2&rotation=0&showTitle=false&size=248825&status=done&style=none&taskId=uf3c971e4-ca75-4e34-ae6d-8e573a48d48&title=&width=917.5)

### 1.6 Explore More Surprises

G6VP contains many amazing functions. You can go to "Open Market/Asset List" to see what other interesting analysis functions are available. For assets that interest you, you can also add them to the shopping cart. The selected asset list can also quickly generate an application template. The G6VP open source version currently contains 79 graph analysis assets, 3 graph element assets, and 9 graph layout assets. Welcome to provide valuable feedback

## 02. Develop G6VP

G6VP uses pnpm to manage the repository. According to pnpm's official [compatibility statement](https://pnpm.io/installation#compatibility), please use nvm to switch the Node.js version to 14 and above.

### 2.1 Install Dependencies

```bash
pnpm install // Will install all dependencies and run the subpackage products at once.
```

### 2.2 Start Insight Site

```bash
cd packages/gi-site
npm run start
```

For more development and build issues, please refer to[《CONTRIBUTING》](/docs/CONTRIBUTING.en-US.md)

## 03 Supported DataSource

- TuGraph-DB：[https://github.com/TuGraph-family/tugraph-db/issues/246](https://github.com/TuGraph-family/tugraph-db/issues/246)
- TuGraph-Analytics：[https://github.com/TuGraph-family/tugraph-analytics/issues/2](https://github.com/TuGraph-family/tugraph-analytics/issues/2)
- GraphScope：[https://github.com/alibaba/GraphScope/issues/2951](https://github.com/alibaba/GraphScope/issues/2951)
- HugeGraph：[https://github.com/apache/incubator-hugegraph/issues/2222](https://github.com/apache/incubator-hugegraph/issues/2222)
- Galaxybase：[https://github.com/antvis/G6VP/pull/207](https://github.com/antvis/G6VP/pull/207)
- Neo4J：[https://github.com/neo4j/neo4j](https://github.com/neo4j/neo4j)
- JanusGraph：[https://github.com/antvis/G6VP/pull/310](https://github.com/antvis/G6VP/pull/310)
- More API DataSource： 10+

## 04 More Reading

- [G6VP, the ultimate weapon for relationship data analysis, is open-source now!](https://www.yuque.com/antv/blog/hvyi6wtaqsgug2a6)
- [The demand list for internal graph visual analysis from a first-tier company is revealed](https://www.yuque.com/antv/gi/hzbk0g)
- [Application of G6VP in supply chain vulnerability analysis](https://www.yuque.com/antv/gi/nxv0yx)
- [How big a scale can G6VP handle relationship data?](https://www.yuque.com/antv/gi/geyqyr)
- [TuGraph + G6VP visualizes your relationship data](https://www.bilibili.com/video/BV1Vv4y1V7tH)

## 05 Open Source Graph Visualization Platform

![](https://api.star-history.com/svg?repos=noduslabs/infranodus,glato/emerge,cytoscape/cytoscape,antvis/G6VP,constellation-app/constellation,aws/graph-explorer,graphia-app/graphia,dmlc/GNNLens2,invana/invana-studio,cylynx/motif.gl,kyleruss/graphi&type=Date#id=d2DaR&originHeight=533&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- https://github.com/gephi/gephi

- https://github.com/neo4j/neo4j-browser

- https://github.com/antvis/G6VP

- https://github.com/noduslabs/infranodus

- https://github.com/glato/emerge

- https://github.com/cytoscape/cytoscape

- https://github.com/constellation-app/constellation

- https://github.com/aws/graph-explorer

- https://github.com/graphia-app/graphia

- https://github.com/dmlc/GNNLens2

- https://github.com/invana/invana-studio

- https://github.com/cylynx/motif.gl

- https://github.com/kyleruss/graphi

## 06 Business Graph Analysis Software

- GraphXR：https://www.kineviz.com/

- Graphaware：https://graphaware.com/features/
