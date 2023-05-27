## 对接 JanusGraph 图数据库

### 安装

官方文档还是写的很清晰的：https://docs.janusgraph.org/ 下面步骤是简化版的

- step1: 通过镜像安装

```bash
docker pull janusgraph/janusgraph:latest
```

- step2: 启动 JanusGraph 服务

```bash
docker run -it -p 8182:8182 janusgraph/janusgraph
```

### 启动代理服务

因为一些原因，Gremlin 官方团队并没有支持 `gremlin-javascript` 在 浏览器端的运行 ，详见这个讨论：https://github.com/apache/tinkerpop/pull/1070

因此在官方支持之前（准确来讲可能需要我们自己去提 PR），我们还是走 node 服务代理转发

```bash
cd packages/gi-assets-janusgraph

node gi-proxy-server.js

```

### 在 G6VP 站点上使用
