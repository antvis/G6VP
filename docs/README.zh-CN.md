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

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](/README.md)

G6VP 取名意为 AntV G6 Visualization Platform，曾用名 `AntV/GraphInsight`，它是一款在线图可视分析产品，也是一款图应用的低代码搭建工具。

![demo2](https://github.com/antvis/G6VP/assets/10703060/40560cd2-3fea-41f8-888b-5abc1eb09b66)

## 01 快速体验

- 站点地址：https://insight.antv.antgroup.com
- 文档地址：https://www.yuque.com/antv/gi

### 1.1 创建数据集

巧妇难为无米之炊，在分析数据之前，我们需要创建一个数据集，数据集可以来自本地的 JSON，CSV，XLSX 文件，可以来自图数据库：TuGraph，GraphScope，HugeGraph，Galaxybase，Neo4j，JanusGraph,也可以是用户自定义的服务，如下图所示，我们选择 Neo4j 某个 database 作为数据集。

![image](https://github.com/antvis/G6VP/assets/10703060/85667759-70b2-4166-8181-47cb9e9fa3a3)

### 1.2 创建工作簿

有了数据，我们便可以创建一个分析画布，创建画布的时候，我们可以选择不同的模版，模版来自资产包，也可以来自用户手动保存或者从资产清单选购的模版。

![image](https://github.com/antvis/G6VP/assets/10703060/91d44a3e-873c-48e6-9a82-3576677d73a8)

### 1.3 配置画布

进入画布后，我们便可以通过侧边栏的「样式」「布局」对画布进行视觉映射，同时也可以在「组件」导航栏中配置整个画布应用，整个图分析能力，在这里可以像搭建积木一样组装起来。

![image](https://github.com/antvis/G6VP/assets/10703060/a1069da9-3034-4580-a3fc-c3d824445d4a)

### 1.4 记得按时保存

记得按时点击右上角的「保存」按钮，这样画布的配置信息都会保存下来，下次进入直接分析

![image](https://github.com/antvis/G6VP/assets/10703060/11779885-5e43-4c37-81c4-54f152d9ebbe)

### 1.5 导出 SDK

对于有研发需要的朋友，可以点击画布的右上角「开放」按钮，即可进行画布的源码导出，目前支持 HTML，CDN，NPM 三种源码导出方式，方便开发者进行二次开发和独立部署

![image](https://github.com/antvis/G6VP/assets/10703060/557a3555-60f6-432f-a898-073bfe478983)

### 1.6 探索更多惊喜

G6VP 产品中包含了很多的惊喜功能，大家可以前往「开放市场 / 资产列表」中查看还有哪些好玩的分析功能，对于感兴趣的资产，还可以加入购物车，在这里选购的资产清单还可以快速生成应用模版。目前 G6VP 开源版本包含图分析资产 79 个，图元素资产 3 个，图布局资产 9 个。欢迎大家多多提宝贵意见～

## 02. 开发 G6VP

G6VP 采用 pnpm 8 和 Node 16 进行开发，Node 版本过高在安装依赖和运行 NPM 脚本时可能存在问题。我们建议使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本，在使用 nvm 切换到 Node 16 环境后运行`npm -g install pnpm@8`安装 pnpm 8。

### 2.1 安装依赖

```bash
pnpm install // 会安装全部的依赖，且将子包的产物一次性运行出来
```

### 2.2 启动站点

```bash
cd packages/gi-site
npm run start
```

更多研发，构建问题，请移步阅读[《共建 G6VP 项目》](/docs/CONTRIBUTING.md)

## 03 扩展阅读

- [关系数据分析利器：G6VP 开源啦！](https://www.yuque.com/antv/blog/hvyi6wtaqsgug2a6)
- [藏不住了!一线大厂内部图可视分析的需求清单](https://www.yuque.com/antv/gi/hzbk0g)
- [G6VP 在供应链漏洞分析场景中应用](https://www.yuque.com/antv/gi/nxv0yx)
- [G6VP 能处理多大规模的关系数据？](https://www.yuque.com/antv/gi/geyqyr)
- [TuGraph + G6VP 让关系数据跃然纸上](https://www.bilibili.com/video/BV1Vv4y1V7tH)

## 04 开源图可视化平台产品

[![Star History Chart](https://api.star-history.com/svg?repos=noduslabs/infranodus,glato/emerge,cytoscape/cytoscape,antvis/G6VP,constellation-app/constellation,aws/graph-explorer,graphia-app/graphia,dmlc/GNNLens2,invana/invana-studio,cylynx/motif.gl,kyleruss/graphi&type=Date)](https://star-history.com/#noduslabs/infranodus&glato/emerge&cytoscape/cytoscape&antvis/G6VP&constellation-app/constellation&aws/graph-explorer&graphia-app/graphia&dmlc/GNNLens2&invana/invana-studio&cylynx/motif.gl&kyleruss/graphi&Date)
