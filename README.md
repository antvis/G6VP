<p align="center">
  <a href="https://graphinsight.antgroup.com">
    <img width="300" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*M6mmTLq_u98AAAAAAAAAAAAADmJ7AQ/original">
  </a>
</p>

<div align="center">

GraphInsight 是一款在线图可视分析产品，也是一款基于 G6/Graphin 的低代码图应用搭建工具。

[![Version](https://badgen.net/npm/v/@antv/gi-sdk)](https://www.npmjs.com/@antv/gi-sdk)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/gi-sdk.svg)](http://npmjs.com/@antv/gi-sdk)
![Latest commit](https://badgen.net/github/last-commit/antvis/graphinsight)

</div>

# 号外！GraphInsight 开源啦

自从今年 6 月 6 号开放使用以来，社区的很多朋友提了很多宝贵的建议，同时也欣喜看到好几家公司已经把 GraphInsight 当作标准化的分析工具在内部使用，也不断有朋友私信，称赞我们的产品理念，想要加入一起共建。为此，我们在 11.22 这个特殊的日子正式开源啦，希望我们的工作，能帮助到社区的用户，大家在图可视分析这条道路上一起越走越远。

GraphInsight 这个产品孵化于内部，当时我们的初心很简单，帮助业务快速创新，业务想要快速创新，研发速度得跟得上，于是我们在 1.0 阶段，做了`GISDK`，它的核心作用是用将图分析画布用一份`Schema JSON`配置描述。这样用户只需要可视化配置面板，即可完成配置，从而导出一个图分析画布。这个就是现在的「开放中心」的雏形。

研发速度虽然快了，但是显然不如定制开发来的精致，后来我们发现业务方对此非常包容， 样式丑点，功能弱点没关系，只要能跑通 POC，做一些关键问题验证就好。于是我们思考，既然目标是要做 POC 验证，那么将分析能力原子化，业务方自己来组合图分析应用岂不是更自由，更高效，于是我们上线了「资产中心」，容器组件，原子组件，分析能力资产化这些概念逐渐被提了出来。
再到后来，越来越多的业务提出数据源怎么解决的问题，我们再次将「资产包」的概念扩展到数据服务中，开始对接各种数据源，上线了「服务中心」这个模块。

我们始终坚信，无论在哪个流程中，图可视分析都有着非常重要的价值。帮助这些用户（无论是图数据研发者，算法工程师，业务分析师）更好更快地上手图，用图的方式，启发解决业务问题，就是 GraphInsight 这个产品最大的存在价值。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1667957903537-ea489c1f-a836-434a-94db-2112bd64880e.png#averageHue=%23543517&clientId=ufafcc337-e0a5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=316&id=WwUIs&margin=%5Bobject%20Object%5D&name=image.png&originHeight=632&originWidth=3520&originalType=binary&ratio=1&rotation=0&showTitle=false&size=714388&status=done&style=none&taskId=u21543359-2a5c-433d-ad01-bde46467df4&title=&width=1760)

# 01. 开发 GraphInsight

GraphInsight 采用 pnpm 管理仓库，根据 pnpm 的官方[兼容性说明](https://pnpm.io/installation#compatibility)，请提前使用 nvm 切换 Node.js 版本到 14 及其以上。

## 安装依赖

```bash
pnpm install // 会安装全部的依赖，且将子包的产物一次性运行出来
```

## 启动站点

```bash
npm run start // 启动 GraphInsight 站点
```

## 项目结构

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
| packages/gi-cli               | `@antv/gi-cli`               | GraphInsight 资产 CLI         |
| packages/gi-common-components | `@antv/gi-common-components` | 通用组件包                    |
| packages/gi-sdk               | `@antv/gi-sdk`               | GraphInsight SDK              |
| packages/gi-site              | `-`                          | GraphInsight 站点             |
| packages/gi-portal            | `-`                          | GraphInsight 首页             |
| packages/gi-httpservice       | `@antv/gi-httpservices`      | GraphInsight BFF 服务         |

# 02. 十分钟，快速体验 GraphInsight

我们以网络上一份 [公开数据集](https://storage.googleapis.com/cylynx-landing-content/banking-connections-demo.json) 为例，原始数据是一份「银行卡之间转账关系」的 JSON，处理下导出到 Excel 表中，于是得到下图两张 Excel 表，左边是点表（银行卡号），右边是边表（转账关系）。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1667952736544-b0395067-ce22-4618-ae3b-35d6c7f8f999.png#averageHue=%23eceae2&clientId=ufafcc337-e0a5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=573&id=pbo4c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1146&originWidth=3448&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3295593&status=done&style=none&taskId=u90a513f2-a33b-45e4-9f14-81aadbfee68&title=&width=1724)

> 相信我，即使你将下图表格放大，看清楚每个字段，你可能还是不清楚这个数据表达了什么，因为要理解这个「转账关系」，关键要把它变成我们脑海中天然浮现出的关系网络图，而不是平躺在表格中一个个生硬的「起点」和「终点」的字段标识。

## 1min：让枯燥的关联表格，变成形象易理解的关系图

打开 GraphInsight 官方站点：[https://graphinsight.antgroup.com/#/workspace](https://graphinsight.antgroup.com/#/workspace) ，点击创建项目，我们将案例数据的两份 Excel 表格导入 GraphInsight 数据源，通过配置节点和边的类型映射，便能得到一张关系网络图
![导入数据.gif](https://cdn.nlark.com/yuque/0/2022/gif/160133/1668414976266-f337c2d4-c030-4baa-b463-a208ee75d2a7.gif#averageHue=%23fefefe&clientId=u6b1ca0e1-8d53-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=ud83f3609&margin=%5Bobject%20Object%5D&name=%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE.gif&originHeight=537&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1607226&status=done&style=shadow&taskId=u6bf0ed57-aaee-4db0-a554-88d9d7a7995&title=)

## 3min：自定义样式，交互，布局，让关系图栩栩如生

GraphInsight 中内置了基础样式，交互，布局设置，所有的配置都可自定义，并能所见即所得反馈给用户。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668415472638-ab744466-257a-465b-83b0-45ee17a66810.png#averageHue=%23fcfbfa&clientId=u6b1ca0e1-8d53-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=301&id=ua26af518&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1154&originWidth=1399&originalType=binary&ratio=1&rotation=0&showTitle=true&size=182795&status=done&style=shadow&taskId=u62e1466c-96a7-47ec-a14b-26be3e942a4&title=%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F&width=365.5 '自定义样式')

## 6min：自由组装资产，持续探索分析

我们在「组件」栏中，选择加载「筛选面板」，选择「高亮」模式，选择关键业务指标「Phone，Address，Amount」等字段，可以清楚看到该字段在图中数据的统计分析情况。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668416957752-0fa1450e-0c53-41d1-955c-31e4ce0d1e97.png#averageHue=%23fdfcfc&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=666&id=u8b1a9c5f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1331&originWidth=2558&originalType=binary&ratio=1&rotation=0&showTitle=false&size=337188&status=done&style=none&taskId=u2b5b4f1b-2251-4901-83ee-05babf39d1f&title=&width=1279)
通过与统计图表交互分析，我们开源发现该数据中，存在同手机号注册，同地址注册的情况，网络中大额资金的转出时间都在凌晨这样的异常情况，稍微有业务经验的朋友就会迅速反应出，这是一个典型的洗钱网络
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1667957533825-0fc3d3ac-d3ea-423d-aee0-956d5b7498e5.png#averageHue=%23f5f2f0&clientId=ufafcc337-e0a5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=484&id=uce10dd36&margin=%5Bobject%20Object%5D&name=image.png&originHeight=968&originWidth=2392&originalType=binary&ratio=1&rotation=0&showTitle=false&size=762852&status=done&style=none&taskId=ud67cbe61-0e52-4821-ae2f-3e84d9b273b&title=&width=1196)

# 03. GraphInsight 三大核心产品能力

GraphInsight 做为一款技术产品，始终围绕一个问题来设计产品：关系数据从哪儿来？关系数据怎么分析？

- **「服务中心」** 用来解决关系数据从哪来的问题：数据可以是本地 Excel 文件，可以是开放 API 接口，抑或是图数据库中的数据。
- **「资产中心」** 用来解决关系数据怎么分析的问题：不同的人群，不同的业务，不同的分析场景，使用的分析方案一定是有差异的。
  GraphInsight 创新性地提出了分析能力原子化，资产化。将架构技术的可插拔设计应用于产品上，于是无论是数据来源还是数据分析问题，产品层面表现出来的都是功能高度自由化，可插拔，按需使用。因此可以在产品发展初期不断做加法，而不用担心加的内容过多，导致功能混乱。
- **「开放中心」** 用来解决「研发提效」问题，作为基于 AntV 技术栈 G6/Graphin 之上的产品，基本职责是要满足研发提效，极大降低图分析应用的研发门槛，同时提效的同时，也能帮助用户做低成本的 POC 验证。
  让我们来一起来看看吧～

## 3.1 资产中心：分析能力资产化，享受搭积木的乐趣

在今年 6 月 6 日开放的时候，我们提供了 35 个分析资产，在今天 AntV 的开源日上，再次增加 26 个分析资产。

| 资产分类             | 6.6（35 个）                                                     | 10.25（26 个）                                                 |
| -------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| 布局资产             | 力导布局，圆形布局，径向布局，                                   |
| 网格布局，同心圆布局 | 资金力导，聚类有向分层布局                                       |
| 容器资产             | 右键菜单，操作栏，工具栏                                         | 圣杯布局，模式切换，侧边导航栏，                               |
| 侧边下拉栏           |
| 画布交互             | 画布设置，清空画布，下载，视图居中，自适应，自由圈选，放大，缩小 | 布局切换                                                       |
| 元素交互             | 属性面板，节点提示框，样式设置                                   | 元素高亮，固定节点，展开收起                                   |
| 系统交互             | 版权，加载动画，小地图，画布占位符，快照画廊                     | 力导控制器，初始化器，大图概览，新增页签，多画布页签，主题设置 |
| 数据分析             | 筛选面板，节点图例，路径分析                                     | 桑基图分析，子图布局，表格模式，                               |
| 信息监测             |
| 数据查询             | 邻居查询                                                         | Gremlin 查询，Cypher 查询，模版查询                            |
| 算法分析             | 节点聚类，节点相似性，社区发现，节点重要性，模式匹配             | 路径结构分析                                                   |
| 场景分析             | 地图模式                                                         | 3D 大图                                                        |
| 工作薄               | 保存分享                                                         | 导出                                                           |

资产数量不是关键，关键的是资产在什么场景下，怎么组合，从而完成业务的分析任务。要想回答这个问题，还需要一些时间的沉淀，这里，我们抛砖引玉，将新增的 26 个资产，总结为六大分析场景介绍如下：

### 3.1.1 数据量大的场景

- [x] 「力导控制器」优化力导计算性能，终于可以手动结束烦人的力导抖动了！
- [x] 「固定节点」如果是力导布局下，拖拽节点可设置自动固定，可设置相关联的节点自动跟随
- [x] 「大图概览」可设置画布展示限制，超过限制，提供可视化筛选功能。
- [x] 「3D 大图」一键切换 3D 展示。可与子图交互。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668419943857-1b3591d1-60f0-4d3e-aff2-d49aea485c79.png#averageHue=%23fdfcfc&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=586&id=u47b92a88&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1172&originWidth=2386&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1669453&status=done&style=shadow&taskId=uda05b63f-fff2-4e05-9eeb-d730e7b74d3&title=&width=1193)

### 3.1.2 多画布场景

- [x] 「多画布页签」：支持画布新增多个页签的功能
- [x] 「添加页签」：支持圈选节点，或者选中后的节点，通过该资产传送到新画布中

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668420057956-309db380-f978-44b1-b7e0-ef0b8b304544.png#averageHue=%23fcfbf8&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=732&id=uc59cb21f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1464&originWidth=2064&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1081443&status=done&style=shadow&taskId=u1bacfcf8-b7ca-492e-b611-ab22456904f&title=&width=1032)

### 3.1.3 多维信息的展示与联动

- [x] 「圣杯布局」：支持上下左右 4 个方位的布局设置，支持展开收起功能。受 ChinaVis 启发

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668420293605-fccde45d-b3a1-4044-bfce-7f239df47786.png#averageHue=%23fbf8f8&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=664&id=ud61748a0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1328&originWidth=2549&originalType=binary&ratio=1&rotation=0&showTitle=false&size=353681&status=done&style=shadow&taskId=u686172c2-2635-4277-a69d-b07911f4423&title=&width=1274.5)

### 3.1.4 明细与汇总场景

- [x] 「表格模式」：支持画布数据用交叉明细表展示，支持双向圈选交互，支持独立页签分屏
- [x] 「初始化器」：支持汇总边设置

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668419518431-bf20d790-ce1e-48c2-a923-d669ec8593a4.png#averageHue=%23fcfcfb&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=477&id=uc37c5ece&margin=%5Bobject%20Object%5D&name=image.png&originHeight=954&originWidth=2166&originalType=binary&ratio=1&rotation=0&showTitle=false&size=231913&status=done&style=shadow&taskId=ubc396e19-05bb-4cf9-9519-25cc016ccd0&title=&width=1083)

### 3.1.5 图数据库，标准查询场景

- [x] 「Gremlin 查询」：支持 Gremlin 语句查询
- [x] 「Cypher 编辑器」：支持 Cypher 语句查询
- [x] 「模版查询」：支持新增语句模版，支持按模版查询

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668420095435-ea1ec08d-1b92-4267-8ffd-869eaa8ca778.png#averageHue=%23b5b5b4&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=271&id=u6d41b0a3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1376&originWidth=1750&originalType=binary&ratio=1&rotation=0&showTitle=true&size=799241&status=done&style=shadow&taskId=uc29e406b-b3b3-4474-bdec-b02692dc1c4&title=%E6%96%B0%E5%A2%9E%E6%A8%A1%E7%89%88%E8%AF%AD%E5%8F%A5&width=345 '新增模版语句')

### 3.1.6 场景化布局

- [x] 「资金力导」：支持 按照资金的出入金额，设置上下的约束力，从而让力导呈现分层效果
- [x] 「聚类有向分层布局」：可以在有向分层的基础上，增加聚类效果，解决传统 dagre 展示分散问题。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668419036142-02195002-2b25-4bf6-8677-396b5abcb431.png#averageHue=%23fefefe&clientId=u64c61c24-8cb7-4&crop=0&crop=0&crop=1&crop=1&errorMessage=unknown%20error&from=paste&height=245&id=udbab7a15&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1168&originWidth=1708&originalType=binary&ratio=1&rotation=0&showTitle=false&size=211349&status=done&style=none&taskId=u9611d343-dacd-4b0d-af5c-316f8ae4108&title=&width=358)

## 3.2 服务中心：内置三款图引擎，支持用户自定义数据服务

在项目的 POC 阶段，我们可以通过样本数据，利用 GraphInsight 的可视化分析能力，从而得出一个验证结果：图分析这套东西，能不能解决我的业务问题？一旦验证通过，我们自然不能再使用样本数据了，想要在真实的业务场景中用起来，此时就需要一套标准的全流程图链路，这条链路中涉及关系数据的存储，加工，计算，以及最后的可视化与业务分析。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1667957903537-ea489c1f-a836-434a-94db-2112bd64880e.png#averageHue=%23543517&clientId=ufafcc337-e0a5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=316&id=gAupH&margin=%5Bobject%20Object%5D&name=image.png&originHeight=632&originWidth=3520&originalType=binary&ratio=1&rotation=0&showTitle=false&size=714388&status=done&style=none&taskId=u21543359-2a5c-433d-ad01-bde46467df4&title=&width=1760)
对于一般的业务决策者而言，面对这条链路显然会沉默很久，因为不仅要考虑新链路带来的技术成本与维护成本，还要考虑实际的效果究竟如何，最终用户是否买单。最最关键的问题还在于，不同的业务场景下，所面临的用户群体是不一样的， 并不是所有的业务都需要标准全链路，比如对于一个算法团队而言，处于成本与实际需要考虑，他们可能只需要图计算而不需要图存储。
GraphInsight 的服务中心就是来解决这个问题的，对于需要全流程验证的用户，我们提供了蚂蚁集团的 TuGraph，以及社区的 Neo4J 数据库的连接方式， 对于只想体验图计算链路的用户，我们提供了阿里巴巴集团的 GraphScope 图计算引擎的连接方式。最后，对于特殊业务场景，需要完全定制数据服务的用户，我们提供了自定义引擎服务的能力。

### 3.2.1 支持用户自定义数据服务

我们先来说最重要的能力：支持用户自定义数据服务。
在 GraphInsight 的产品设计中，分析资产是第一等公民，它决定了如何与用户进行交互与展示，有的分析资产运行起来需要数据接口的协同，比如「邻居查询」资产。用户右键交互查询，需要一个下钻的接口，此时该资产也决定了如何与服务端进行交互与接口规范。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668470736892-42137160-89a0-4c9b-bc2d-a057e43571e3.png#averageHue=%23f7f4f2&clientId=u66492888-2fab-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=459&id=COV3M&margin=%5Bobject%20Object%5D&name=image.png&originHeight=918&originWidth=2410&originalType=binary&ratio=1&rotation=0&showTitle=false&size=691220&status=done&style=shadow&taskId=u62cb4ad3-b22d-404d-98ce-5fbabf41e00&title=&width=1205)
如上图所示，用户右键菜单选择「1 度扩散」的时候，发一起一个服务查询，该服务接口（`NeighborsQuery`）与当前项目选择的引擎 ID（`TuGraph`）会拼凑成唯一的服务 ID（`TuGraph/NeighborsQuery`），从而具体匹配到服务中心里的接口，实现数据查询。
**_自定义资产数据服务，其实就是用户按照规范实现每一个分析资产需要的服务接口，然而将这些资产服务打包成一个服务资产包，上传到 GI 站点中即可使用。_**在开源仓库中，我们也实现了一个`[MyCustomServer](https://github.com/antvis/GraphInsight/tree/master/packages/my-custom-server)` 的自定义服务包，欢迎大家感兴趣移步查看。
目前官方提供的资产服务接口汇总如下：

| 资产 ID              | 资产名称   | 服务 ID                 | 服务名称         |
| -------------------- | ---------- | ----------------------- | ---------------- |
| Initializer          | 初始化器   | GI_SERVICE_INTIAL_GRAPH |
| GI_SERVICE_SCHEMA    | 初始化查询 |
| 查询图模型           |
| PropertiesPanel      | 属性面板   | PropertiesPanel         | 查询属性详情     |
| NeighborsQuery       | 邻居查询   | NeighborsQuery          | 邻居查询         |
| Save                 | 保存分享   | Save                    | 保存图画布的接口 |
| LanguageQueryService | 语句查询   | LanguageQueryService    | 图语句查询接口   |
| ThemeSetting         | 主题设置   | AddTheme                |

GetTheme
UpdateTheme
RemoveTheme | 添加主题
获取主题
更新主题
删除主题 |

### 3.2.2 内置连接 GraphScope 单机版图计算引擎

> 详情参考「[如何使用 GraphScope 开源版引擎](https://www.yuque.com/antv/gi/xikt2gmg0mhv9nw2)」

![image.png](https://cdn.nlark.com/yuque/0/2022/png/244306/1668480916893-58777f58-24d8-4440-ba50-93d48f9aa08b.png#averageHue=%23fbfafa&clientId=ucd4e2c34-6bc2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=103&id=u087a1ad5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1452&originWidth=3246&originalType=binary&ratio=1&rotation=0&showTitle=true&size=331553&status=done&style=none&taskId=uf6883498-ce09-40f4-950c-e065d18a97e&title=%E4%BD%BF%E7%94%A8%20Gremlin%20%E8%AF%AD%E5%8F%A5%E6%9F%A5%E8%AF%A2&width=230 '使用 Gremlin 语句查询')

### 3.2.3 内置连接 TuGraph 单机版图数据库

> 详情参考「[如何使用 TuGraph 数据库](https://www.yuque.com/antv/gi/wuvtyf)」。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668474481802-b9c08d52-c4fd-4eba-a2fa-ed9b73031d5c.png#averageHue=%23fcfbfb&clientId=u66492888-2fab-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=227&id=ue7603542&margin=%5Bobject%20Object%5D&name=image.png&originHeight=830&originWidth=1222&originalType=binary&ratio=1&rotation=0&showTitle=true&size=134695&status=done&style=shadow&taskId=u91518819-266d-4e38-84fa-d1d02c1edee&title=%E8%BF%9E%E6%8E%A5TuGraph&width=334 '连接TuGraph')

### 3.2.4 内置连接 Neo4J 在线版图数据库

> 详情参考「[如何使用 Neo4j 图数据库](https://www.yuque.com/antv/gi/otnlbq2dc9q1f8gt)」。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/244306/1668480174359-e9b068e3-8bee-46fe-94b8-609f29070555.png#averageHue=%23d2d0cb&clientId=ucd4e2c34-6bc2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=182&id=ufe19cb35&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1360&originWidth=2692&originalType=binary&ratio=1&rotation=0&showTitle=true&size=1057858&status=done&style=none&taskId=ub453ff3d-f321-4e09-9e9a-05bd1a8c780&title=%E8%BF%9E%E6%8E%A5%20Neo4j&width=360 '连接 Neo4j')

## 3.3 开放中心：一键导出 SDK，极速原生部署

开放中心 是 GraphInsight 用来解决「研发提效」问题，作为基于 AntV 技术栈 G6/Graphin 之上的产品，基本职责是要满足研发提效，极大降低图分析应用的研发门槛，同时提效的同时，也能帮助用户做低成本的 POC 验证。
用户在分析页面，点击「导出 SDK」，便可以看到有 4 种导出方式：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1668475003259-bb8cd4c9-3717-45d5-876c-fce8039ec3c2.png#averageHue=%23e9e8e4&clientId=ua4df3ded-9acc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=492&id=ub87a5aa3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=984&originWidth=1406&originalType=binary&ratio=1&rotation=0&showTitle=false&size=427186&status=done&style=none&taskId=u9e79bb2d-2245-4ae2-9fc9-953ddd741c5&title=&width=703)
其中「云端部署」是主要是配合「GraphScope」使用的，目前暂时仅在阿里集团内部使用。因为开源，我们也支持了导出「NPM」包的方式，支持 Tree Shaking，原生集成到 React 项目中。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1667958140918-4410b14e-1304-431a-aabb-966e345ef4ba.png#averageHue=%239f9f9f&clientId=ufafcc337-e0a5-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=803&id=u8fd93ad9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1606&originWidth=2682&originalType=binary&ratio=1&rotation=0&showTitle=false&size=728802&status=done&style=none&taskId=u5d61a80d-c6ef-4c8b-a9e4-b910a7d0ef9&title=&width=1341)

# FAQ

## 进入到每个子包中启动，遇到依赖找不到的问题

注意 ⚠️： cd 到每个子包的目录时候，一定要注意查看 node 的版本，比如我的默认 node 版本是 12， 切换到 16 装完所有依赖，此时进入到每个子包中， node 的版本自动切换到 12，执行命令是找不到安装的依赖的，所以得重新 `nvm use 16`，这样就可以了,如果想一劳永逸，可以在 zsh terminal 中设置

```bash
nvm alias default v16.17.0
```

## 如何发布版本

因为我们组件间的依赖关系用 pnpm 管理的，即`workspace:*`，因此发布到 npm 仓库，可以使用`pnpm publish`，该命令会自动将`workspace:*`转化为对应的版本。如果我们是私有仓库，比如阿里内部的 tnpm 仓库，
便可以使用下述 script 命令，将代码发布到 tnpm 仓库中

```
npm run npm:publish
```

## 如何将资产发布到 CDN 上

资产包发布后，如果是公开的，国内用：https://www.jsdelivr.com/ ，国外可用：https://unpkg.com/
