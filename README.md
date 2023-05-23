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

G6VP 取名意为 AntV G6 Visualization Platform, 它是一款在线图可视分析产品，也是一款基于 G6/Graphin 的低代码图应用搭建工具。

![demo2](https://github.com/antvis/G6VP/assets/10703060/40560cd2-3fea-41f8-888b-5abc1eb09b66)


## 01.快速体验

- 站点地址：https://insight.antv.antgroup.com
- 文档地址：https://www.yuque.com/antv/gi

### 创建数据集

巧妇难为无米之炊，在分析数据之前，我们需要创建一个数据集，数据集可以来自本地的 JSON，CSV，XLSX 文件，也可以来自图数据库：TuGraph，GraphScope，HugeGraph，Galaxybase，Neo4j 等数据库，也可以是用户自定义的服务，如下图所示，我们选择 Neo4j 某个 database 作为数据集。
![image](https://github.com/antvis/G6VP/assets/10703060/85667759-70b2-4166-8181-47cb9e9fa3a3)

### 创建工作薄

有了数据，我们便可以创建一个分析画布，创建画布的时候，我们可以选择不同的模版，模版来自资产包，也可以来自用户手动保存或者从资产清单选购的模版。
![image](https://github.com/antvis/G6VP/assets/10703060/91d44a3e-873c-48e6-9a82-3576677d73a8)

### 配置画布

进入画布后，我们便可以通过侧边栏的「样式」「布局」对画布进行视觉映射，同时也可以在「组件」导航栏中，配置整个画布应用，整个图分析能力，在这里可以像搭建积木一样组装起来。
![image](https://github.com/antvis/G6VP/assets/10703060/a1069da9-3034-4580-a3fc-c3d824445d4a)

### 记得按时保存

就得记得按时点击右上角的「保存」按钮，这样画布的配置信息都会保存下来，下次进入直接分析
![image](https://github.com/antvis/G6VP/assets/10703060/11779885-5e43-4c37-81c4-54f152d9ebbe)

### 导出 SDK
点击画布的右上角「开放」按钮，即可进行画布的源码到处，目前支持 HTML，CDN，NPM 三种源码导出方式，方便开发者进行二次开发和独立部署
![image](https://github.com/antvis/G6VP/assets/10703060/557a3555-60f6-432f-a898-073bfe478983)

### 探索更多惊喜

G6VP 产品中包含了很多的惊喜功能，大家可以前往「开放市场 / 资产列表」中查看还有哪些好玩的分析功能，对于感兴趣的资产，还可以加入购物车，这份选购的资产清单还可以快速生成应用模版。目前 G6VP 开源版本包含图分析资产 79 个，图元素资产 3 个，图布局资产 9 个。欢迎大家多多提宝贵意见～


## 02. 开发 G6VP

G6VP 采用 pnpm 管理仓库，根据 pnpm 的官方[兼容性说明](https://pnpm.io/installation#compatibility)，请提前使用 nvm 切换 Node.js 版本到 14 及其以上。

### 安装依赖

```bash
pnpm install // 会安装全部的依赖，且将子包的产物一次性运行出来
```

### 启动站点

```bash
cd packages/gi-site
npm run start 
```

### 项目结构

项目中 packages 包含以下 9 个 package：

他们依次对应的包名与解释如下：

| 文件路径                      | 包名                         | 说明                          |
| ----------------------------- | ---------------------------- | ----------------------------- |
| packages/gi-assets-advance    | `@antv/gi-assets-advance`    | 高级资产包                    |
| packages/gi-assets-algorithm  | `@antv/gi-assets-algorithm`  | 算法资产包                    |
| packages/gi-assets-basic      | `@antv/gi-assets-basic`      | 基础资产包                    |
| packages/gi-assets-scene      | `@antv/gi-assets-scene`      | 场景资产包                    |
| packages/gi-assets-graphscope | `@antv/gi-assets-graphscope` | GraphScope 引擎服务（单机版） |
| packages/gi-assets-neo4j      | `@antv/gi-assets-neo4j`      | Neo4j 引擎服务                |
| packages/gi-assets-tugraph    | `@antv/gi-assets-tugraph`    | TuGraph 引擎服务              |
| packages/gi-assets-galaxybase | `@antv/gi-assets-galaxybase` | Galaxybase 引擎服务           |
| packages/gi-assets-hugegraph  | `@antv/gi-assets-hugegraph`  | HugeGraph 引擎服务            |
| packages/gi-cli               | `@antv/gi-cli`               | G6VP 资产 CLI                 |
| packages/gi-common-components | `@antv/gi-common-components` | 通用组件包                    |
| packages/gi-sdk               | `@antv/gi-sdk`               | G6VP SDK                      |
| packages/gi-site              | `-`                          | G6VP 站点                     |
| packages/gi-portal            | `-`                          | G6VP 首页                     |
| packages/gi-httpservice       | `@antv/gi-httpservices`      | G6VP BFF 服务                 |


## 扩展阅读
- [关系数据分析利器：G6VP 开源啦！](https://www.yuque.com/antv/blog/hvyi6wtaqsgug2a6)
- [TuGraph + G6VP让关系数据跃然纸上](https://www.bilibili.com/video/BV1Vv4y1V7tH)
- [藏不住了!一线大厂内部图可视分析的需求清单](https://www.yuque.com/antv/gi/hzbk0g)
- [G6VP 在供应链漏洞分析场景中应用](https://www.yuque.com/antv/gi/nxv0yx)
- [G6VP 能处理多大规模的关系数据？](https://www.yuque.com/antv/gi/geyqyr)


## FAQ

### 进入到每个子包中启动，遇到依赖找不到的问题

注意 ⚠️： cd 到每个子包的目录时候，一定要注意查看 node 的版本，比如我的默认 node 版本是 12， 切换到 16 装完所有依赖，此时进入到每个子包中， node 的版本自动切换到 12，执行命令是找不到安装的依赖的，所以得重新 `nvm use 16`，这样就可以了,如果想一劳永逸，可以在 zsh terminal 中设置

```bash
nvm alias default v16.17.0
```

### 如何发布版本

G6VP 采用 [changesets](https://pnpm.io/using-changesets) 来进行包版本管理和发布，因此不需要手动维护版本号，只需要在提交代码时，使用`pnpm run changeset`来生成对应的版本号即可。

- 1. 发布前准备

按照下列步骤选择要发布的子包并更新版本号

```bash
# 本地全部重新安装依赖，并且执行通过 build:all:es 和 build:all:umd

pnpm install --force

npm run build:all:umd

# 添加需要发布的子包
pnpm changeset

# 更新子包版本号，并生成 changeset 文件
pnpm changeset version
```

> 发布完成后再将生成的 changeset 文件添加变更并提交到主分支仓库

- 2. 发布子包

> 需要提前登录

```bash
npm run publish
```

- 3. 子包发布后，需要同步到 CDN 上

如果是公开的，国内用：https://www.jsdelivr.com/ ，国外可用：https://unpkg.com/
如果是非公开的，则使用给自公司的 CDN 平台进行同步

- 4. 发布主站点

```bash
cd pacakges/gi-site
npm run build
```

- 5. 本地验证

执行 `code dist` ,使用 vscode 打开站点的产物，使用 live-server 等工具，将站点产物托管起来。访问 web 地址，验证站点是否正常运行，主要需要验证的点是，各个子包的产物是否正确发布到 CDN 上

- 6. 发布到 github pages 上

```bash
cd packages/gi-site
npm run deploy
```

### 如何打包 gi-httpservice

- 在根目录下执行 `npm run tar:gi-httpservice`
