## 开发 GraphInsight

GraphInsight 采用 pnpm 管理仓库，packages 中包含以下 5 个 package：

他们依次对应的包名与解释如下：

| 文件路径                       | 包名                           | 说明       |
| ------------------------------ | ------------------------------ | ---------- |
| packages/gi                    | `@alipay/graphinsight`         | GISDK      |
| packages/gi-assets-basic       | `@alipay/gi-assets-basic`      | 基础资产包 |
| packages/gi-assets-advance     | `@alipay/gi-assets-advance`    | 高级资产包 |
| packages/gi-assets-scene       | `@alipay/gi-assets-scene`      | 场景资产包 |
| packages/gi-assets-algorithm   | `@alipay/gi-assets-algorithm`  | 算法资产包 |
| packages/gi-common-components  | `@alipay/gi-common-components` | 通用组件   |
| packages/gi-site               | `-`                            | 官方站点   |
| packages/gi-portal             | `-`                            | 官方首页   |
| packages/gi-standalone-service | `-`                            | BFF 服务   |

## 安装

```bash
pnpm install
```

## 启动站点

```bash
npm run start
```
