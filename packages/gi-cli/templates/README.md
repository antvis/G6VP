## GraphInsight 资产包的模版

## 安装

```bash
npm i

```

## 本地启动 DEMO

本地通过 umi 启动一个 从 GI 站点中导出的 demo

```bash
npm run start
```

## 自定义分析资产

我们以自定义一个统计器为例： `src/components/Counter`，没有什么高科技，就是普通的 React 组件，只是会比普通的组件包，导出结构多几个字段参数，用于在 GraphInsight 站点上协同。

```jsx
import Component from './Component'; // 组件实现
import info from './info'; //组件的元信息
import registerMeta from './registerMeta'; //组件 props 的 Schema 表达，采用 formily 方案
export default { info, component: Component, registerMeta };
```

和画布相关的上下文，统一使用 React Context 机制

```jsx
import { useContext } from '@antv/gi-sdk';
const Counter = props => {
  const { graph, data, updateContext } = useContext(); //updateContext 用于更新 Context
  return <></>;
};
export default Counter;
```

## 自定义服务资产

参考代码： `src/components/services`，导出的格式为:

```jsx
export default {
  id: 'MyServer',
  type: 'api',
  name: '我的服务',
  desc: 'MyServer',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*3YEZS6qSRgAAAAAAAAAAAAAAARQnAQ',
  component: Server,
  services: {
    ...Initializer,
  },
};
```

其中 `component` 字段用于 展示在 GI 的站点上，用于设置启动，停止服务，以及设置服务所需要的上下文参数。 `services`字段用于复写已有的 GI 资产服务。其中每个 Service ID 由对应的资产的 `info.services` 决定

**_在 GI 的设计中，资产是第一等公民_**，即一个资产可以定义自己该如何触发（Interaction + Action），触发后如何响应数据 （ Data ），以及拿到数据后改如何展示（View）,目前 GI 共有 61 个资产，其中仅有 6 个资产有数据服务，包含 10 个 `**ServiceId **`如下表所示:

| 资产 ID         | 资产名称     | **ServiceId**                                 | 服务名称                  |
| --------------- | ------------ | --------------------------------------------- | ------------------------- |
| Initializer     | 初始化器     | GI_SERVICE_INTIAL_GRAPH<br/>GI_SERVICE_SCHEMA | 初始化查询<br/>查询图模型 |
| GremlinQuery    | Gremlin 查询 | GremlinQuery                                  | 查询 Gremlin 接口         |
| NeighborsQuery  | 邻居查询     | NeighborsQuery                                | 邻居查询                  |
| PropertiesPanel | 属性面板     | PropertiesPanel                               | 查询属性详情              |
| Save            | 保存分享     | Save                                          | 保存图画布的接口          |

## 本地打包

```bash
npm run build
```

产物的 UMD 包名通过 webpack 改写了，改写逻辑：

```jsx
const ASSETS_UMD = name.split('-').join('_').toUpperCase();
```

本地启动 HTTPServer，比如 VsCode 的 [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件。然后上传到 [GraphInsight 资产中心 ](https://graphinsight.antgroup.com/#/assets)

于是我们便可以在 GraphInsight 中享用自定义的资产和服务啦

![消费自定义服务](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZmYESK-f3RAAAAAAAAAAAAAADmJ7AQ/original)
![消费自定义资产](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6H8qQqKdDL0AAAAAAAAAAAAADmJ7AQ/original)

资产包验证没问题，可以发布 npm 包，或者发布到 CDN 上
国内可用：https://www.jsdelivr.com/ ，国外可用：https://unpkg.com/
