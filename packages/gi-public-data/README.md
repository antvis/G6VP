## GraphInsight Public Data

当我们在 G6VP 上配置了应用站点，想通过 G6VP 平台公开分享项目。那么我们需要给 `@antv/gi-public-data`提 PR，按照约定提供 JSON 文件即可。

## Step1：上传配置文件

访问 G6VP 官方站点 https://insight.antv.antgroup.com ，在画布中，点击「备份」，即可得到一个 `.txt`文件。通过 github pull request，放置在开源仓库 `https://github.com/antvis/G6VP/tree/master/packages/gi-public-data/app` 中，并在 `https://github.com/antvis/G6VP/tree/master/packages/gi-public-data/index.json` 中指定该配置文件所包含的应用信息

```json
[
  {
    //托管到 G6VP 官方站点的路由地址：https://insight.antv.antgroup.com/app/timeline
    "route": "timeline",
    // 配置文件放置的位置：/gi-public-data/app/timeline.json
    "config": "/app/timeline.json",
    // 应用名称
    "title": "时序图项目",
    // 应用描述
    "desc": "这是一个时序图分析的案例，展示了区块链反洗钱的分析手法",
    // 应用头图，可以省略
    "cover": ""
  }
]
```

## Step2：访问在线应用

当提的 PR 经过官方合并后，且确认发布 `@antv/gi-public-data`后，刷新官方站点，访问
`https://insight.antv.antgroup.com/open/app` 即可看到
