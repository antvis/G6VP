## TuGraph 资产包

@alipay/gi-assets-tugraph 是基于 GraphInsight 规范开发的资产包，用于搭建 TuGraph Explore。

TuGraph Explore 资产包：@alipay/gi-assets-tugraph

GraphScope 团队的图分析资产包

## 快速开始

安装依赖:

```bash
$ yarn
```

启动服务:

```bash
$ yarn dev
```

在本地开发和测试 TuGraph 资产包时，强依赖 TuGraph Explore 服务，因此，在启动资产包服务之前，我们需要先启动 TuGraph Explore 服务。

### 致谢

其中 CypherEditor 组件是基于 Neo4j 的 (CodeMirror)[https://github.com/neo4j-contrib/CodeMirror] 进行改造的，Cypher mode 和 codemirror 样式文件都是直接使用的 Neo4j 的文件，感谢 Neo4j 团队。
