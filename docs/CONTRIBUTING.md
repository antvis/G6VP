欢迎共建 G6VP 项目

## 01 项目结构

项目中 packages 包含以下 9 个 package：

他们依次对应的包名与解释如下：

| 文件路径                             | 包名                                | 说明                          |
| ------------------------------------ | ----------------------------------- | ----------------------------- |
| packages/gi-assets-advance           | `@antv/gi-assets-advance`           | 高级资产包                    |
| packages/gi-assets-algorithm         | `@antv/gi-assets-algorithm`         | 算法资产包                    |
| packages/gi-assets-basic             | `@antv/gi-assets-basic`             | 基础资产包                    |
| packages/gi-assets-scene             | `@antv/gi-assets-scene`             | 场景资产包                    |
| packages/gi-assets-graphscope        | `@antv/gi-assets-graphscope`        | GraphScope 引擎服务（单机版） |
| packages/gi-assets-neo4j             | `@antv/gi-assets-neo4j`             | Neo4j 引擎服务                |
| packages/gi-assets-tugraph           | `@antv/gi-assets-tugraph`           | TuGraph 引擎服务              |
| packages/gi-assets-tugraph-analytics | `@antv/gi-assets-tugraph-analytics` | TuGraph Analytics 服务        |
| packages/gi-assets-galaxybase        | `@antv/gi-assets-galaxybase`        | Galaxybase 引擎服务           |
| packages/gi-assets-hugegraph         | `@antv/gi-assets-hugegraph`         | HugeGraph 引擎服务            |
| packages/gi-cli                      | `@antv/gi-cli`                      | G6VP 资产 CLI                 |
| packages/gi-common-components        | `@antv/gi-common-components`        | 通用组件包                    |
| packages/gi-sdk                      | `@antv/gi-sdk`                      | G6VP SDK                      |
| packages/gi-site                     | `-`                                 | G6VP 站点                     |
| packages/gi-portal                   | `-`                                 | G6VP 首页                     |
| packages/gi-httpservice              | `@antv/gi-httpservices`             | G6VP BFF 服务                 |

### 02 如何发布版本

G6VP 采用 [changesets](https://pnpm.io/using-changesets) 来进行包版本管理和发布，因此不需要手动维护版本号，只需要在提交代码时，使用`pnpm run changeset`来生成对应的版本号即可。

- 1. 发布前准备

按照下列步骤选择要发布的子包并更新版本号

```bash
# 本地全部重新安装依赖，并且执行通过 build:all:es 和 build:all:umd

pnpm install --force

npm run build:all:umd

# 添加需要发布的子包
pnpm changeset

# 更新子包版本号，并生成 changeset 文件
pnpm changeset version
```

> 发布完成后再将生成的 changeset 文件添加变更并提交到主分支仓库

- 2. 发布子包

> 需要提前登录

```bash
npm run publish
```

- 3. 子包发布后，需要同步到 CDN 上

如果是公开的，国内用：https://www.jsdelivr.com/ ，国外可用：https://unpkg.com/
如果是非公开的，则使用给自公司的 CDN 平台进行同步

- 4. 发布主站点

```bash
cd pacakges/gi-site
npm run build
```

- 5. 本地验证

执行 `code dist` ,使用 vscode 打开站点的产物，使用 live-server 等工具，将站点产物托管起来。访问 web 地址，验证站点是否正常运行，主要需要验证的点是，各个子包的产物是否正确发布到 CDN 上

- 6. 发布到 github pages 上

```bash
cd packages/gi-site
npm run deploy
```

### 03 如何打包 gi-httpservice

- 在根目录下执行 `npm run tar:gi-httpservice`

## 第三方资产包研发，以 https://github.com/TuGraph-family/gi-assets-tugraph-db 为例

- clone G6VP Repo

```bash
git clone https://github.com/antvis/G6VP.git
cd G6VP
pnpm install
```

### 脚本 link 的方式

- link gi-assets-tugraph-db

```bash
$ git clone https://github.com/TuGraph-family/gi-assets-tugraph-db.git
# current path
$ pwd
$ cd /G6VP/packages/gi-site
$ pnpm run link /User/YourPath/xxx/xxx/gi-assets-tugraph-db GI_ASSETS_TUGRAPH_DB
```

- devlop tugraph-db assets

```bash
cd /G6VP/packages/gi-assets-tugraph-db

npm run start

cd /G6VP/packages/gi-site

npm run start

```

### 手动 git submodule 的方式

- step1: 在 G6VP 的仓库中，产生一个子 module

```bash

cd g6vp/pacakages

git clone https://github.com/TuGraph-family/gi-assets-tugraph-db.git

```

- step2: 调整 gi-site 的依赖

```bash

cd packages/gi-site

cat pacakage.json // 手动修改依赖如下

```

```json
{
  "dependencies": {
    "@tugraph/gi-assets-tugraph-db": "workspace:*"
  }
}
```

- step3: 修改 `/gi-site/scripts/pre-build-inject.json`

```json
[
  {
    "name": "@tugraph/gi-assets-tugraph-db",
    "version": "0.2.0",
    "global": "GI_ASSETS_TUGRAPH_DB"
  }
]
```

- step4: 修改 `/gi-site/src/services/inject.ts`

```js
import * as GI_ASSETS_TUGRAPH_DB from '@tugraph/gi-assets-tugraph-db';
export default {
  GI_ASSETS_TUGRAPH_DB,
};
```

- step5: 重新安装依赖

```bash
cd g6vp

pnpm install
```
