### Antd 主题设置工具

业务中通常存在 3 种 CSS 设置情况

- Antd 样式魔改：局部组件和设计规范有出入，需要加`global`魔改
- Antd 主题样式：比如黑色主题下，所有的`@component-background`为`#171819`
- 自定义 业务样式：写 less 文件，通过`css module` 方案引入，主题切换方案，通过 CSS 的`var` 语法

## 使用说明

- 本地安装

```bash
pnpm install
```

- 编译组件

```
npm run start
```

- 编译 CSS

```
npm run build:css
```
