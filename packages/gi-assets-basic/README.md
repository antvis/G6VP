## G6VP 基础资产包

## 依赖包

```tsx
  externals: {
      lodash: '_',
      react: 'React',
      'react-dom': 'ReactDOM',
      '@antv/g2Plot': 'G2Plot',
      '@antv/g6': 'G6',
      antd: 'antd',
      '@antv/graphin': 'Graphin',
      '@antv/gi-sdk': 'GISDK',
    },
```

### 容器组件 4 个

| 组件           | 分类     | 名称       | 说明                                       |
| -------------- | -------- | ---------- | ------------------------------------------ |
| ContextMenu    | 容器组件 | 右键菜单   | 帮助用户进行节点或边操作：打标，扩散，发现 |
| OperatorBar    | 容器组件 | 操作栏     | 业务操作栏                                 |
| OperatorHeader | 容器组件 | 分组操作栏 | 分组的业务操作栏                           |
| Toolbar        | 容器组件 | 工具栏     | 存放画布常用工具                           |

### 交互组件 4 个

| 组件            | 分类         | 名称       | 说明                                                 |
| --------------- | ------------ | ---------- | ---------------------------------------------------- |
| CanvasSetting   | 交互组件     | 画布设置   | 帮助用户进行画布操作：缩小，放大，全屏               |
| FitCenter       | 交互组件     | 撤销回退   | 帮助用户进行全局导航                                 |
| FitView         | 交互组件     | 鱼眼放大镜 | 帮助用户进行查看细节                                 |
| LassoSelect     | 交互组件     | 边建联组件 | 帮助用户进行关系建联                                 |
| RedoUndo        | 标示组件     | 图例       | 帮助用户进行节点和边的类型标示：颜色，大小，属性     |
| Tooltip         | 标示组件     | 轮廓       | 帮助用户进行节点归类示                               |
| Statistic       | 标示组件     | 统计面板   | 帮助用户进行画布状态的监控标示                       |
| FilterPanel     | 分析配套组件 | 筛选面板   | 提供快速筛选功能                                     |
| SnapshotGallery | 分析配套组件 | 快照画廊   | 提供快照保存复现功能，帮助用户分析过程不中断         |
| LayoutSelector  | 分析配套组件 | 布局切换器 | 帮助用户切换布局，自主调节参数，从而达到最佳布局效果 |
| Sheetbar        | 分析配套组件 | 多画布组件 | 帮助用户二次分析，多画布管理                         |
| TableMode       | 分析配套组件 | 表格模式   | 帮助通过表格查看关系源数据                           |
| FindPathPanel   | 算法分析组件 | 寻找路径   | 帮助用户计算两个节点间的最短路径和可能路径列表       |
| MapMode         | 高级分析组件 | 地图模式   | 帮助用户分析地理关系数据                             |
| Timebar         | 高级分析组件 | 时间轴     | 帮助用户分析时序关系数据                             |

### 信息展示组件 4 个

| 组件           | 分类     | 名称       | 说明                                       |
| -------------- | -------- | ---------- | ------------------------------------------ |
| Tooltip        | 容器组件 | 右键菜单   | 帮助用户进行节点或边操作：打标，扩散，发现 |
| OperatorBar    | 容器组件 | 操作栏     | 业务操作栏                                 |
| OperatorHeader | 容器组件 | 分组操作栏 | 分组的业务操作栏                           |
| Toolbar        | 容器组件 | 工具栏     | 存放画布常用工具                           |

## 开发步骤

## 02.本地测试

每个资产都有一个`index.md` 文件，采用 dumi 进行渲染，用户使用 `@antv/gi-assets-testing` 包即可快速测试。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/97618/1641378392662-b39f89d8-9daa-410e-aba7-d590d83d4a49.png#clientId=u9eac05c3-3072-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1231&id=uaf3645c9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1231&originWidth=1361&originalType=binary&ratio=1&rotation=0&showTitle=false&size=206752&status=done&style=none&taskId=uedbfb812-ae5e-485c-8b3a-beb980f802b&title=&width=1361)

## 03.发布

第一次发布资产，需要手动在雨燕上「新建三方库」：[https://yuyan.antfin-inc.com/lib/new](https://yuyan.antfin-inc.com/lib/new) ，以「@antv/gi-assets-basic」为例如下图所示，点击新建。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/97618/1641377456620-2fcfd738-a023-4a4e-8130-2f5b6c365ac1.png#clientId=u9eac05c3-3072-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1089&id=uc8c36365&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1089&originWidth=1316&originalType=binary&ratio=1&rotation=0&showTitle=false&size=101250&status=done&style=none&taskId=uf198441f-5243-45fe-b6df-e98581bb060&title=&width=1316)

- 点击发布，发布到 CDN 上，之后每次发布的版本，直接点击同步即可。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/97618/1641377676807-54613c46-39e9-45c5-80cf-ed9fbe4b6ad9.png#clientId=u9eac05c3-3072-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=294&id=ua5a179f4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=294&originWidth=1294&originalType=binary&ratio=1&rotation=0&showTitle=false&size=36709&status=done&style=none&taskId=u35bf5ff4-80a6-4d65-9cdc-0da64253e4a&title=&width=1294)

## 04.同步在 GI 平台上消费

输入 tnpm 包名，和资产 CDN 地址，即可在 GI 平台上完成消费。
