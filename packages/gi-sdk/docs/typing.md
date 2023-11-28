---
title: 类型参考
order: 1
group:
  path: /gi-sdk
  title: GISDK
  order: 0
nav:
  title: GISDK
  path: /sdk
  order: 1
---

## AssetInfo

| 属性            | 类型            | 描述       |
| --------------- | --------------- | ---------- |
| `id`            | `string`        | 资产 ID    |
| `name`          | `string`        | 资产名称   |
| `cover`         | `string`        | 资产缩略图 |
| `type`          | `AssetType`     | 资产类型   |
| `icon`          | `string`        | 资产 ID    |
| `category`      | `AssetCategory` | 资产分类   |
| `desc`          | `string`        | 资产描述   |
| `[key: string]` | `any`           | 额外的属性 |

整个 info 元信息中，`id` 和 `type` 是必选的， `id` 默认需要「组件名」「组件文件夹名」保持一致，`type` 决定了资产的运行时渲染逻辑

| AssetType            | 描述                   |
| -------------------- | ---------------------- |
| `AUTO`               | 自加载组件 initializer |
| `INITIALIZER`        | 初始化组件             |
| `GICC`               | 容器组件，可以多选     |
| `GICC_LAYOUT`        | 布局容器组件, 只能单选 |
| `GICC_MENU`          | 容器组件（菜单）       |
| `GIAC`               | 原子组件               |
| `GIAC_CONTENT`       | 原子组件（内容）       |
| `GIAC_MENU`          | 原子组件（菜单）       |
| `NODE`               | 节点                   |
| `EDGE`               | 边                     |
| `LAYOUT`             | 布局算法               |
| `GI_CONTAINER`       | 兼容旧版本             |
| `GI_CONTAINER_INDEX` | 兼容旧版本             |

| AssetCategory          | 描述     |
| ---------------------- | -------- |
| `container-components` | 容器组件 |
| `canvas-interaction`   | 画布交互 |
| `elements-interaction` | 元素交互 |
| `data-analysis`        | 数据分析 |
| `data-query`           | 数据查询 |
| `system-interaction`   | 系统交互 |
| `styling-analysis`     | 样式分析 |
| `algorithm-analysis`   | 算法分析 |
| `workbook`             | 工作簿   |

## Config 配置表！id 用来匹配组件，props 用于运行时参数

| 属性         | 类型                       | 描述             |
| ------------ | -------------------------- | ---------------- |
| `layout`     | `GILayoutConfig`           | 图的布局配置     |
| `components` | `Array<GIComponentConfig>` | 组件配置数组     |
| `nodes`      | `Array<GINodeConfig>`      | 节点配置数组     |
| `edges`      | `Array<GIEdgeConfig>`      | 边配置数组       |
| `pageLayout` | `GIComponentConfig`        | 页面布局组件配置 |

| GIComponentConfig | 类型        | 描述               |
| ----------------- | ----------- | ------------------ |
| `id`              | `string`    | 组件配置的唯一标识 |
| `name`            | `string`    | 组件的名称，可选   |
| `type`            | `AssetType` | 资产类型           |
| `props`           | `Object`    | 组件的属性配置     |

| GINodeConfig / GIEdgeConfig | 类型      | 描述                     |
| --------------------------- | --------- | ------------------------ |
| `id`                        | `string`  | 节点配置的唯一标识       |
| `name`                      | `string`  | 节点的名称，可选         |
| `props`                     | `Object`  | 节点的属性配置           |
| `expressions`               | `Array`   | 表达式数组，用于条件渲染 |
| `logic`                     | `boolean` | 逻辑标识                 |
| `groupName`                 | `string`  | 分组名称                 |
| `default`                   | `boolean` | 是否为默认设置           |

| GILayoutConfig | 类型           | 描述               |
| -------------- | -------------- | ------------------ |
| `id`           | `string`       | 布局配置的唯一标识 |
| `props`        | `LayoutConfig` | 布局的属性配置     |
