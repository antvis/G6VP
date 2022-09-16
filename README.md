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

## 进入到每个子包中启动

注意 ⚠️： cd 到每个子包的目录时候，一定要注意查看 node 的版本，比如我的默认 node 版本是 12， 切换到 16 装完所有依赖，此时进入到每个子包中， node 的版本自动切换到 12，执行命令是找不到安装的依赖的，所以得重新 `nvm use 16`，这样就可以了

- node 版本 12，直接启动报错找不到依赖

```ts
sh: father: command not found
npm ERR! code ELIFECYCLE
npm ERR! syscall spawn
npm ERR! file sh
npm ERR! errno ENOENT
npm ERR! @alipay/gi-common-components@1.7.0 start: `npm run clean && father build --watch`
```

- node 版本切换到 16，就能成功执行

```ts
 gi-common-components git:(master) ✗
node -v
v12.22.8
➜  gi-common-components git:(master) ✗ nvm use 16
Now using node v16.17.0 (npm v8.15.0)
➜  gi-common-components git:(master) ✗ npm run start
> @alipay/gi-common-components@1.7.0 start
> npm run clean && father build --watch
```

> 为解决这个问题，可以在 zsh terminal 中设置

```bash
nvm alias default v16.17.0
```

### 版本发布

因为我们组件间的依赖关系用 pnpm 管理的，即`workspace:*`，因此发布到 npm 仓库，可以使用`pnpm publish`，该命令会自动将`workspace:*`转化为对应的版本。如果我们是私有仓库，比如阿里内部的 tnpm 仓库，
便可以使用下述 script 命令，将代码发布到 tnpm 仓库中

```
npm run tnpm:publish
```
