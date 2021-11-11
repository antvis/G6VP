## 开发 GraphInsight

GraphInsight 采用 lerna 管理仓库，packages 中包含以下 3 个 package：

```bash
/packages
    gi
    gi-meta
    gi-site
```

他们依次对应的包名与解释如下：

| 文件路径         | 包名                   | 说明                   |
| ---------------- | ---------------------- | ---------------------- |
| packages/gi      | `@alipay/graphinsight` | GI 图可视分析 SDK      |
| packages/gi-meta | `@alipay/gi-meta`      | GI 平台 的属性配置面板 |
| packages/gi-site | `-`                    | GI 平台 的官方站点     |

- 设置 npmClient

在 `lerna.json` 中设置你的 npmClient，可选：

1. `npm` 默认
1. `yarn`
1. `tnpm` 公司内可使用

```json
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "version": "0.0.0"
}
```

- 安装依赖

在`该项目根目录`下执行命令：

```bash
npm i
```

- 安装各 packages 的依赖

然后在`该项目根目录`下，启动 lerna 的 bootstrap，lerna 自动安装好各个 packages 的依赖，安装好后，可以发现各个 packages 中就存在自己的 node_modules 了

```bash
npm run bootstrap
```

- 启动 依赖包 的本地编译

在`该项目根目录`启动 `gi` `gi-meta` `gi-site` 的本地编译.

```bash
npm run core   //本地编译`@alipay/graphinsight`的产物
npm run assets   //本地编译`@alipay/gi-assets`的产物
npm run site   //本地编译`@alipay/gi-site`的产物，需先执行上面步骤
```

- 启动 GraphInsight 官方站点

```bash
npm run site
```

注意 ⚠️ ： 随着项目的开发，会有新的依赖被加入`package.json`中，请不要`tnpm install`去安装，都在项目根目录下执行`npm run bootstrap`让 lerna 去安装这个新依赖
