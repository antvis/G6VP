# 嗨，这有一份图可视分析的需求清单，邀请你在 6 月 6 号查收！

随着企业业务逻辑越来复杂，数据越来越多源异构，涉及更广更深的关联分析，以关系型数据库为基础的企业数字化基础面临着诸多挑战，为了解决这些挑战，图技术开始大规模兴起，从图存储到图计算，再到图分析产品。
这些图分析产品在金融风控，反洗钱，案件调查，客户 360，网络安全威胁检测等诸多领域发挥着重要价值，面对这么多兴起的产品，无论你是产品经理，还是研发同学，抑或是交付工程师，都会问一个问题：**_有什么好的案例，好的技术，好的方案，帮助我做一个图分析应用呢？_**
刚好，这里有一份图可视化分析的需求清单，也许能够在你技术和产品选型阶段，做出一点帮助.

# 01.基础版

在基础需求清单中，我们首先要满足用户「看清关系数据」的需求，因此，我们要有基础的样式，自然的交互，合理的布局。

## 1.1 基础样式

- [✅] 设置颜色：支持填充色，描边色，透明度
- [✅] 设置大小：支持支持文本/主图形/图标等的大小设置
- [✅] 设置文本：支持多文本，支持换行展示
- [✅] 边：支持多边，支持自环，支持虚线，支持曲线，支持边动画，支持标签背景色
- [✅] 节点：支持图标，支持徽标，支持光晕，支持透明度，颜色细粒度设置

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776897-87769685-1926-4b6c-991d-b95f5b8e5767.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=453&id=MOQcU&margin=%5Bobject%20Object%5D&name=image.png&originHeight=840&originWidth=703&originalType=binary&ratio=1&rotation=0&showTitle=true&size=91976&status=done&style=shadow&taskId=uadd696be-3e17-4f0b-894b-2eb3b647cb5&title=%E8%8A%82%E7%82%B9%E6%A0%B7%E5%BC%8F&width=379.5 "节点样式")![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776899-748cac0e-df77-4374-a2bc-873564736f56.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=457&id=CI6MM&margin=%5Bobject%20Object%5D&name=image.png&originHeight=913&originWidth=683&originalType=binary&ratio=1&rotation=0&showTitle=true&size=104570&status=done&style=shadow&taskId=ubb998557-a205-482c-bb43-284aa51052b&title=%E8%BE%B9%E7%9A%84%E6%A0%B7%E5%BC%8F&width=341.5 "边的样式")

## 1.2 基础交互

- [✅] 画布交互：支持放大，缩小，框选，鼠标缩放，平移画布，自适应，1:1 展示画布。
- [✅] 节点交互：支持点击选中，拖拽节点，支持关联高亮，支持鼠标悬停展示提示框，支持点击查看详情面板。
- [✅] 边交互：支持鼠标悬停，点击选中。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776885-abe89004-0e59-43d6-bfb5-0ceb692e9f70.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=261&id=ubfc6769e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=414&originWidth=493&originalType=binary&ratio=1&rotation=0&showTitle=true&size=31465&status=done&style=shadow&taskId=u77219b44-eb22-446e-a6c9-d06f2f1c36a&title=%E6%A1%86%E9%80%89%20%26%20%E9%AB%98%E4%BA%AE&width=310.5 "框选 & 高亮")![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776900-2cdc26be-6d18-432d-b8dc-7bfcfc04b020.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=265&id=uba9cd70f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=529&originWidth=794&originalType=binary&ratio=1&rotation=0&showTitle=true&size=70120&status=done&style=shadow&taskId=u3f8c3251-e193-4644-8b1f-601d76e09b8&title=%E7%82%B9%E5%87%BB%20%26%20%E5%B1%9E%E6%80%A7%E8%AF%A6%E6%83%85%E9%9D%A2%E6%9D%BF&width=397 "点击 & 属性详情面板")
上述所有的功能，在 GraphInsight 平台上都是一个个原子组件，可以自由组合，如下图所示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776916-bedeed5f-5016-4e38-8b20-93ec5bf44b57.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=198&id=ub0ebdf04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=467&originWidth=1769&originalType=binary&ratio=1&rotation=0&showTitle=false&size=98860&status=done&style=shadow&taskId=u03d8690b-2b81-4318-895e-e460cf1f8df&title=&width=749)

## 1.3 画布布局

> 5 种 基础布局，并且支持详细参数设置，支持布局切换，支持布局缓存。

- [✅] 力导布局
- [✅] 圆形布局
- [✅] 同心圆布局
- [✅] 径向布局
- [✅] 有向分层布局

## 1.4 页面布局

> 支持系统 3 种 基础布局，且每种布局都可以自由调整放置的区域，偏移量，宽度，高度，是否独立 DOM 等

- [✅] 工具栏：常常用于集成 画布操作相关 的 交互组件，例如放大，缩小等
- [✅] 操作栏：常常用于集成 业务操作相关 的 分析组件，例如数据查询，算法面板，导出，保存分享等。
- [✅] 侧边栏：常常用于集成 业务分析流程 的 组件，例如查询，筛选，样式配置，最短路径等。

# ![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778042-9b711d0e-444a-4a7f-a015-7abd3feabf39.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=668&id=kkIwj&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1336&originWidth=2556&originalType=binary&ratio=1&rotation=0&showTitle=false&size=320053&status=done&style=shadow&taskId=ub7d5d2ed-69d9-4238-98b5-ce65bfda55d&title=&width=1278)

# 02.高级版

高级版中，重点是实现用户动态分析图的诉求，可能用户需要根据分析的思路，不断调整样式，不断调整布局，扩展数据，筛选数据，保存分析思路等。

## 2.1 分组样式

- [✅] 节点和边支持分组设置，系统默认按照「类型」来分组
- [✅] 支持自定义属性过滤，例如下图，可以将多个条件组合起来

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402777975-47cad0b3-cb40-4586-b93e-1dd512c6d675.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=423&id=u074552be&margin=%5Bobject%20Object%5D&name=image.png&originHeight=846&originWidth=1611&originalType=binary&ratio=1&rotation=0&showTitle=false&size=154355&status=done&style=shadow&taskId=u4f80a474-835c-40d5-95c3-508c1ebb05c&title=&width=805.5)

## 2.2 多元素类型渲染

- [✅] 一个画布中，可以存在多种不同类型元素，例如下图，将某个节点用「甜甜圈」节点渲染。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778051-46fbd7a3-39f2-4786-b611-7252bb7ca573.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=328&id=uc0d99a22&margin=%5Bobject%20Object%5D&name=image.png&originHeight=656&originWidth=1115&originalType=binary&ratio=1&rotation=0&showTitle=false&size=109854&status=done&style=shadow&taskId=u8a184c2f-1adf-47f2-a1cd-cf9e5ebed33&title=&width=557.5)

## 2.3 筛选过滤器

- [✅] 支持属性字段过滤
- [✅] 支持过滤规则组合
- [✅] 数据筛选后的画布：支持数据改变，重新布局
- [✅] 数据筛选后的画布：支持数据不变，仅高亮展示。
- [✅] 筛选的结果可视化展示：支持词云，饼图，折线图，折线图，下拉菜单 等方式

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778163-df185d86-4b41-4ad4-81b7-3f210fa6c734.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=575&id=ub1da8676&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1149&originWidth=1913&originalType=binary&ratio=1&rotation=0&showTitle=false&size=251271&status=done&style=shadow&taskId=u1649ad2a-cb11-40ab-a38a-c82bb38f3a8&title=&width=956.5)

## 2.4 邻居扩散

- [✅] 支持集成到右键菜单中
- [✅] 支持一度，二度，三度扩散的配置
- [✅] 支持扩散的数据服务自定义
- [✅] 支持扩散的子图的样式区别

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778267-026d23b5-259e-4f7f-99da-5b18d8b612ab.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=481&id=u2cab17c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=961&originWidth=1563&originalType=binary&ratio=1&rotation=0&showTitle=false&size=192817&status=done&style=shadow&taskId=u4867f0dd-ca01-4261-b874-7ed4adb1f71&title=&width=781.5)

## 2.5 多画布页签

**当分析思路出现「分叉」的时候，就需要新增一个画布去单独完成「分叉支路」的分析任务**。这个工作往往由画布页签来完成，技术取名「Sheetbar」，灵感也是来源传统 E✅cel 中的「sheetbar」

- [✅] 支持新增空白画布，画布重命名，删除画布
- [✅] 支持框选画布的元素，然后将框选后的子图追加到新的画布中
- [✅] 支持页签间的画布 DOM 与通信完全隔离

![home-sheetbar.gif](https://cdn.nlark.com/yuque/0/2022/gif/160133/1653402779133-de2ae334-f92b-45b1-9588-8c5c86af6bdb.gif#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=u50f6a0f0&margin=%5Bobject%20Object%5D&name=home-sheetbar.gif&originHeight=976&originWidth=1404&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&taskId=uab6563e1-dd1f-4fea-a6b0-30be16626e7&title=)

## 2.6 路径分析

在网络安全中，人们可以使用「路径分析」查看主机入侵分析，在金融风控中，可以使用「路径分析」查看洗钱路径，在企业风控中，可以使用「路径分析」查看持股关系。

- [✅] 支持路径的纯前端算法查询
- [✅] 支持过滤路径：最短路径，自定义规则过滤
- [✅] 支持高亮展示路径，支持路径切换展示

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402779896-b6fa4f6e-4765-404d-be64-bb8b2dedff66.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=518&id=u3af9a639&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1036&originWidth=1663&originalType=binary&ratio=1&rotation=0&showTitle=false&size=407652&status=done&style=shadow&taskId=ufd87be08-551e-4897-99f9-a8052a7f464&title=&width=831.5)

# 03.场景版

## 3.1 地理分析

- [✅] 支持数据中的地理位置字段映射到「高德地图」或「AMap」
- [✅] 支持圈选地理中的位置进行与图分析画布的交互

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402779900-99544094-67a6-4f5f-bb3b-039e34f08331.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=421&id=u8b28eec0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=842&originWidth=1803&originalType=binary&ratio=1&rotation=0&showTitle=false&size=208631&status=done&style=shadow&taskId=u03877089-11b2-4c0b-aafc-87767ac38fb&title=&width=901.5)

## 3.2 大图分析

当画布数量超过一定数量的时候，可以启动「3D 大图渲染」，用户在三维的画布上，可以很容易看到之前在 2D 画布上难以看到的关系和团伙。
![大图.gif](https://cdn.nlark.com/yuque/0/2022/gif/160133/1653402779734-bf7b1404-144b-4f33-b848-3e9da17b2a68.gif#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=ufbb83014&margin=%5Bobject%20Object%5D&name=%E5%A4%A7%E5%9B%BE.gif&originHeight=501&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&taskId=u53780437-5f3a-41bf-bd02-de5b12224b6&title=)

---

不知道上述的清单是否能够满足你们的图分析业务，不过，上述的这些功能，我们都将在今年**6 月 6 号**的 **GraphInsight**新品发布会为你带来，敬请期待！
内测版本：[https://graphinsight.antv.vision/home.html#/](https://graphinsight.antv.vision/home.html#/)
对 GraphInsight 感兴趣的同学，欢迎扫码入群：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653403059811-870df50f-d519-4723-bddf-88ac24af4647.png#clientId=u9bcfec59-b86b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=416&id=rrC0K&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1280&originWidth=979&originalType=binary&ratio=1&rotation=0&showTitle=false&size=352354&status=done&style=shadow&taskId=u7c01b54b-3b6c-46aa-be51-6555762abb7&title=&width=318)
