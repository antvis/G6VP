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

![demo2](https://github.com/antvis/G6VP/assets/10703060/40560cd2-3fea-41f8-888b-5abc1eb09b66)

## 01 Quick Start

- Site: https://insight.antv.antgroup.com
- Documentation: https://www.yuque.com/antv/gi

### 1.1 Create a Dataset

Before analyzing data, we need to create a dataset. The dataset can be a local JSON, CSV, XLSX file, or a graph database, such as TuGraph, GraphScope, HugeGraph, Galaxybase,JanusGraph and Neo4j. It may also be a user-defined service, as shown below, where we choose a Neo4j database as the dataset.

![image](https://github.com/antvis/G6VP/assets/10703060/85667759-70b2-4166-8181-47cb9e9fa3a3)

### 1.2 Create a Workbook

With the data, we can create an analysis canvas. When creating a canvas, we can choose different templates. The template may come from an asset package or it may be manually saved or selected from an asset inventory.

![image](https://github.com/antvis/G6VP/assets/10703060/91d44a3e-873c-48e6-9a82-3576677d73a8)

### 1.3 Configure the Canvas

After entering the canvas, we can use the "Style" and "Layout" in the sidebar to map the visual representation of the canvas. At the same time, the entire canvas application, and the entire graph analysis capability, can be configured in the "Components" navigation panel. Components can be assembled like building blocks.

![image](https://github.com/antvis/G6VP/assets/10703060/a1069da9-3034-4580-a3fc-c3d824445d4a)

### 1.4 Remember to Save Timely

Remember to click the "Save" button in the upper right corner in a timely manner. This way, the configuration information of the canvas will be saved, and it can be analyzed directly next time.

![image](https://github.com/antvis/G6VP/assets/10703060/11779885-5e43-4c37-81c4-54f152d9ebbe)

### 1.5 Export SDK

For friends in need of development, you can click the "Export" button in the upper right corner of the canvas to export the source code of the canvas. Currently, HTML, CDN, and NPM export methods are supported, which facilitates developers to carry out secondary development and independent deployment.

![image](https://github.com/antvis/G6VP/assets/10703060/557a3555-60f6-432f-a898-073bfe478983)

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

## 03 More Reading

- [G6VP, the ultimate weapon for relationship data analysis, is open-source now!](https://www.yuque.com/antv/blog/hvyi6wtaqsgug2a6)
- [The demand list for internal graph visual analysis from a first-tier company is revealed](https://www.yuque.com/antv/gi/hzbk0g)
- [Application of G6VP in supply chain vulnerability analysis](https://www.yuque.com/antv/gi/nxv0yx)
- [How big a scale can G6VP handle relationship data?](https://www.yuque.com/antv/gi/geyqyr)
- [TuGraph + G6VP visualizes your relationship data](https://www.bilibili.com/video/BV1Vv4y1V7tH)
