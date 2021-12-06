GISDK 是 GraphInsight 平台开放出来的 React 组件，用于第三方开发部署。 它的使用非常简单。首先用户需要在 [GraphInsight](http://preview.alipay.net/graphInsight/#/workspace) 平台上新建项目，这里参考《GI 平台使用指南》，然后导出 HTML
​

## 01. 导出 HTML 整理

目前 GI 站点导出 HTML，暂不支持多文件的导出（后续会做），因此，这里需要用户手动整理导出的 HTML。以 GI 的一个导出文件 为例 [gi-export-project-id-2900001.html](https://yuque.antfin.com/attachments/lark/0/2021/html/97618/1638776781692-66747499-e68f-41be-a446-0320e8001d25.html?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fyuque.antfin.com%2Fattachments%2Flark%2F0%2F2021%2Fhtml%2F97618%2F1638776781692-66747499-e68f-41be-a446-0320e8001d25.html%22%2C%22name%22%3A%22gi-export-project-id-2900001.html%22%2C%22size%22%3A8690%2C%22type%22%3A%22text%2Fhtml%22%2C%22ext%22%3A%22html%22%2C%22status%22%3A%22done%22%2C%22taskId%22%3A%22u416a90f0-48b9-4bf2-b663-5dd51668b20%22%2C%22taskType%22%3A%22upload%22%2C%22id%22%3A%22ud8f84c87%22%2C%22card%22%3A%22file%22%7D)
我们建议开发者，将 `GI_SERVICES_OPTIONS` `GI_PROJECT_CONFIG` `GI_LOCAL_DATA` 这三个常量放在一个独立的文件中， `GI_EXPORT_FILES` 中。这样文件分离的目的是便于后续的升级维护，GI 站点导出的文件可以随意替换，而我们本地二次开发的文件不受升级影响。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/97618/1638775437151-c640e5b6-2c39-46c1-8a21-bd0ac3ef6b72.png#clientId=u40ec653f-5eb7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=368&id=ub286ecbf&margin=%5Bobject%20Object%5D&name=image.png&originHeight=368&originWidth=1018&originalType=binary&ratio=1&rotation=0&showTitle=false&size=271475&status=done&style=none&taskId=u874de8f3-ed98-4fe8-b5fa-19c4d2ba2a3&title=&width=1018)

## 02.本地组件开发部署

```tsx
import GISDK from '@alipay/graphinsight'
import GIAssets from '@alipay/gi-assets';
import {GI_SERVICES_OPTIONS,GI_LOCAL_DATA,GI_PROJECT_CONFIG}= './GI_EXPORT_FILES.ts'

const {utils,...assets} = GIAssets;

const MyGraphSdk = () => {
  const config = GI_PROJECT_CONFIG;
  const services = utils.getServicesByAssets(GI_SERVICES_OPTIONS, GI_LOCAL_DATA);
  const assets = { ...ASSETS, services };

  return (
    <div style={{ height: "100vh" }}>
      <GISDK config={config} assets={assets} />
    </div>
  );
};
```

GISDK 只接受两个参数的输入。 `assets` 表示图画布渲染需要的「组件实例」，`config` 代表 GI 平台导出的配置。
默认情况下，使用 GI 平台导出的 SDK，用户无需改一行代码，即可立即部署到自己的业务系统中。当用户在 GI 平台上，找不到自己业务需要的组件的时候，这个时候，便可以进行「云端资产研发」与「本地资产研发」。**_这篇文章，我们终点介绍「本地资产研发」_**
​

## 03.本地资产研发，文件目录

本地研发的类型分为 4 类，分别为「服务」「元素」「组件」「资产」，这里我们的最佳实践是，分别新建 4 个文件夹来存放本地研发的资产。

- services：研发服务
- elements：研发元素
  - 研发边
  - 研发节点
- layouts：研发布局
- components：研发组件
  - 普通组件
  - 原子组件
  - 容器组件

## 04. Services 服务研发

拿到 SDK，我们第一件事情就是要对接服务，讲 GI 平台上上传的 Mock 数据替换为我们真实的业务接口。

### 4.1 数据规范，先添加 Transform 函数

因为在 GI 平台中，我们的数据使用是有一套数据规范的，即节点必须有「id」和「data」字段，边必须有「source」「target」「data」字段。其中「data」字段是存放业务自己的数据的，避免数据污染。

```typescript
export interface Node {
	id:string;
  data:any;
  [key:string]:any
}
export interface Edge {
	source:string;
  target:string;
  data:any;
  [key:string]:any
}
const data = {
	nodes:Node[]
  edges:Edge[]
}
```

因此，我们要根据自己业务的后端数据，准备好一个 transform 函数，例如下图
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/97618/1638777658960-cfa4aefa-5ae4-4f80-981e-88d7581bff08.png#clientId=u4f2219bd-662c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1026&id=ub4499cdc&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1026&originWidth=1888&originalType=binary&ratio=1&rotation=0&showTitle=false&size=650764&status=done&style=none&taskId=u4a3d6e4b-3675-49bc-a79d-176bc812964&title=&width=1888)

### 4.2 初始化数据：GI_SERVICE_INTIAL_GRAPH

画布上每次刷新，默认展示的数据，即为初始化数据。在 GI 平台中，我们用 ID 为 `GI_SERVICE_INTIAL_GRAPH` 的服务表示，这个 ID 是固定的，即

```tsx
const MyService = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    service: () => {
      return fetch('http://初始化接口服务');
    },
  },
];
```

### 4.3 其他数据服务

其他的数据服务，例如，接口查询详情，接口下钻，一度关系查询等等接口，在 GI 的规范中，都是由相应的组件触发的，因此 ID 可以随意修改，只要能够和对应的组件所需要的服务 ID 匹配上即可。
​

```tsx
const MyService = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH', // GISDK必须的服务，可以初始化返回空数据，即空白画布
    service: () => {
      return fetch('http://初始化接口服务');
    },
  },
  {
    id: 'query_node_detail', // 可能在 NodeAttrs 组件中使用
    service: () => {
      return fetch('http://查询详情接口');
    },
  },
  {
    id: 'query_expand_graph', // 可能在 NodeExpand 组件中使用
    service: () => {
      return fetch('http://查询扩散接口');
    },
  },
  {
    id: 'mock_services_xxx', //自己mock接口，只要符合Promise数据结构即可
    service: () => {
      return new Promise(resolve => {
        resolve({ nodes: [], edges: [] });
      });
    },
  },
];
```

## 05. Components 组件研发

结合业务场景，进行组件自定义研发，恐怕是业务中最常见的需求了。我们将由易到难，讲解组件研发的流程与规范。**_这里我们以一个具体的组件来举例子，NodeCount，用于实时统计画布的节点和边的数量。_**
​

### 5.1 组件研发的目录结构

对于我们普通的 React 组件开发，我们书写了 Component.tsx 组件，可能只需要直接引用就行，对于 GI 的组件资产而言，**_我们的 export default 必须是一个 对象，其对象中的 3 个 Key 值是固定的，即 info，component 和 registerMeta _**

```tsx
import Component from './Component';
// registerMeta 是用于 Component组件属性Props的可视化表达， 采用dataV的规范
import registerMeta from './registerMeta';

// info 字段用户GI平台上的各种展示，后续计划从 index.md 中解析得到默认值，也可用户手动修改
const info = {
  id: 'NodeCount',
  type: '',
  name: '节点统计',
  category: 'components',
  desc: '节点统计',
  cover: 'http://xxxx.jpg',
};

export default {
  info,
  component: Component,
  registerMeta,
};
```

### 5.2 组件规范：info 字段

- INFO：字段用户 GI 平台上的各种展示，后续计划从 index.md 中解析得到默认值，也可用户手动修改
  | INFO 字段 | 详细描述 |
  | --- | --- |
  | **id** | **组件的唯一标识，不可重复，用于资产消费** |
  | **type** | **组件资产的类型，用于资产消费：**
- GI_CONTAINER 代表容器组件
- GI_CONTAINER_INDEX 代表可被集成到容器组件中的原子组件
- 后续可能扩展，用户可以不用感知。
  |
  | name | 组件的名称，用于 GI 平台展示 |
  | category | 资产的分类，用于 GI 平台展示。components 代表是组件资产 |
  | desc | 资产的描述，用于 GI 平台展示 |
  | cover | 资产的缩略图，用于 GI 平台展示 |

### 5.3 组件规范：component 字段

component 字段挂载的是组件的实例，用于 GI 平台和 GISDK 的渲染消费。举一个非常简单的组件，例如，在图画布上添加统计节点信息的面板。将文本的信息 title 作为 porps 输入。**_注意 ⚠️：GI 的技术基于 Graphin，因此可以通过 GraphinContext 拿到画布的 graph 实例_**

```tsx
import * as React from 'react';
import { GraphinContext } from '@antv/graphin';

const CountInfo: React.FunctionComponent<DownLoad> = props => {
  const { graph } = React.useContext(GraphinContext);
  const { nodes, edges } = graph.save() as {
    nodes: any[];
    edges: any[];
  };
  const { title } = props;
  return (
    <div style={{ position: 'absolute', top: '10px', left: '20px' }}>
      <h1>{text}</h1>
      NODES: {nodes.length}
      EDGES: {edges.length}
    </div>
  );
};

export default CountInfo;
```

### 5.4 组件规范：registerMeta 字段

registerMeta 用于 Component 组件属性 props 的可视化表达， 采用 dataV 的规范，详情参考：[https://yuque.antfin-inc.com/aandm7/aighig/lcfwgq](https://yuque.antfin-inc.com/aandm7/aighig/lcfwgq)
例如上述的例子，我们如果希望用户可以在 GI 平台上动态改变 title，那么就可以在 registerMeta 中编写这个 props 的 UI 展示。GISDK 会自动关联。

```tsx
export const (context)=>{
	return {
    title:{
      name:"组件的名称",
      type: 'text',
      default: '节点统计',
    },
  }
}
```

### 5.5 组件消费

​

组件开发完毕，既可以加载到 GISDK 中，进行消费。这个时候就可以改造我们的 GISDK。

```tsx
import GISDK from '@alipay/graphinsight'
import GIAssets from '@alipay/gi-assets';
import {GI_SERVICES_OPTIONS,GI_LOCAL_DATA,GI_PROJECT_CONFIG}= './GI_EXPORT_FILES.ts'
import services from './services'
const {utils,...assets} = GIAssets;
import MyComponentsAssets from './components'

// 资产的构建
const assets = {
  ...ASSETS,
  services,
  components:{
    ...ASSETS.components,
    ...MyComponentsAssets,
  }
};

// 资产的消费
const config = GI_PROJECT_CONFIG;
config.components.push({
	id:"CountInfo",
  props:{}
});


const MyGraphSdk = () => {
  return (
    <div style={{ height: "100vh" }}>
      <GISDK config={config} assets={assets} />
    </div>
  );
};
```

​

##

​
