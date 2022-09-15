## 开发 GraphInsight

GraphInsight 采用 pnpm 管理仓库，根据 pnpm 的官方[兼容性说明](https://pnpm.io/installation#compatibility)，请提前使用 nvm 切换 Node.js 版本到 14 及其以上。

### 安装依赖

```bash
pnpm install
```

### 启动站点

```bash
npm run start
```

### 项目结构

项目中 packages 包含以下 9 个 package：

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
