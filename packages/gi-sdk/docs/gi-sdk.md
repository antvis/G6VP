---
title: 基本介绍
order: 1
group:
  path: /quick-start
  title: 快速开始
  order: 3
nav:
  title: GISDK
  path: /sdk
  order: 1
---

## 使用场景

GISDK 是构建 G6VP 产品的技术底座，它由 Graphin 组件封装而成，旨在通过提供统一的配置文件`config`,资产包`assets`，配合开放多源的服务`services` 即可渲染出一个图分析应用。

大多数情况下，用户在 G6VP 产品上选择数据源，配置分析参数，导出代码即可得到这么一个可运行的 GISDK，无缝嵌入到自己的应用中。如下图所示

<code src='./demos/gi-sdk.tsx'>

但是在少部分情况下，我们需要脱离 G6VP 产品，直接以「写代码」的方式集成。如下图所示：

<code src='./demos/gi-sdk.tsx'>

## 属性解释
