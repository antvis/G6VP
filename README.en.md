## GraphInsight Official Address

GraphInsight is an online graph visual analysis product and a low-code graph analysis application development tool. The AntV team officially opened it to the public on 2022.06.06.

In China, it is recommended to visit the address:

- https://graphinsight.antgroup.com/home.html#/

In foreign regions, you can visit the address hosted on GithubPages:

- https://graphinsight.antv.vision/home.html#/

If you think the product is good, you can give a star to G6, the powerful graph visual analysis engine and Graphin,the graph analysis component. They are the core library for graphinsight. Your support is our greatest encouragement!

- https://github.com/antvis/G6
- https://github.com/antvis/Graphin

If you have any questions about the use of the product, you can report it to the ISSUE area, or you can join the community DingTalk group to discuss (at the bottom of the article)

## GraphInsight Release Conference

> Click the video link below to view the content of that day

- [GraphInsight Go to the future with original intention - 御术](https://www.bilibili.com/video/BV1cg41197FL?spm_id_from=333.999.0.0)

- [GraphInsight New Product Release - 山果](https://www.bilibili.com/video/BV1mg411X7Bh/?spm_id_from=333.788.recommend_more_video.0)

- [Graphlnsight Application Practice in Supply Chain Vulnerability Analysis Scenario - 刘宏达](https://www.bilibili.com/video/BV1TF411V7wM?spm_id_from=333.999.0.0)

- [GraphInsight Efficient graph computing engine behind GraphScope - 徐静波](https://www.bilibili.com/video/BV1L94y1U7rU?spm_id_from=333.999.0.0)

# [Can't hide] List of requirements for visual analysis of internal diagrams of leading enterprise

As the business logic of enterprises becomes more and more complex, the data comes from more and more multi-source heterogeneous, and involves wider and deeper correlation analysis. The enterprise digital foundation based on relational databases faces many challenges. In order to solve these challenges, graph technology began to rise in a large scale, from graph storage to graph computing, and then to graph analysis products.
These graph analysis products play an important role in financial risk control, anti-money laundering, case investigation, customer 360, network security threat detection and many other fields. In the face of so many emerging products, whether you are a product manager, or a R & D engineer, or a delivery engineer, you will always ask a question: **Are there any good cases, good technologies or good solutions to help me make a graph analysis application?**
As it happens, here is a list of requirements for graph visualization analysis, which may be able to help you a little in the stage of technology and product selection.

# 01.Basic

In the list of basic requirements, we must first meet the needs of users to "see relational data clearly". Therefore, we must have basic styles, natural interactions, and reasonable layouts.

## 1.1 Basic Style

- ✅ Set color: support fill color, stroke color, transparency
- ✅ Set Size: support size settings for text/main graphics/icons, etc.
- ✅ Set text: support multiple texts, wrapping display
- ✅ Edges: support multi-edge, self-loop, dotted line, curve, edge animation, label background color.
- ✅ Nodes: support icons, logos, halo, transparency, fine-grained color settings

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776897-87769685-1926-4b6c-991d-b95f5b8e5767.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=453&id=MOQcU&margin=%5Bobject%20Object%5D&name=image.png&originHeight=840&originWidth=703&originalType=binary&ratio=1&rotation=0&showTitle=true&size=91976&status=done&style=shadow&taskId=uadd696be-3e17-4f0b-894b-2eb3b647cb5&title=%E8%8A%82%E7%82%B9%E6%A0%B7%E5%BC%8F&width=379.5 "节点样式")![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776899-748cac0e-df77-4374-a2bc-873564736f56.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=457&id=CI6MM&margin=%5Bobject%20Object%5D&name=image.png&originHeight=913&originWidth=683&originalType=binary&ratio=1&rotation=0&showTitle=true&size=104570&status=done&style=shadow&taskId=ubb998557-a205-482c-bb43-284aa51052b&title=%E8%BE%B9%E7%9A%84%E6%A0%B7%E5%BC%8F&width=341.5 "边的样式")

## 1.2 Basic Interaction

- ✅ Canvas interaction: support zoom in, zoom out, frame selection, mouse zoom, pan canvas, adaptive, 1:1 display canvas.
- ✅ Node interaction: support click to select, drag and drop nodes, support association highlighting, support hover to display prompt box, support click to view details panel.
- ✅ Side interaction: support hover and click

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776885-abe89004-0e59-43d6-bfb5-0ceb692e9f70.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=261&id=ubfc6769e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=414&originWidth=493&originalType=binary&ratio=1&rotation=0&showTitle=true&size=31465&status=done&style=shadow&taskId=u77219b44-eb22-446e-a6c9-d06f2f1c36a&title=%E6%A1%86%E9%80%89%20%26%20%E9%AB%98%E4%BA%AE&width=310.5 "框选 & 高亮")![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776900-2cdc26be-6d18-432d-b8dc-7bfcfc04b020.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=265&id=uba9cd70f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=529&originWidth=794&originalType=binary&ratio=1&rotation=0&showTitle=true&size=70120&status=done&style=shadow&taskId=u3f8c3251-e193-4644-8b1f-601d76e09b8&title=%E7%82%B9%E5%87%BB%20%26%20%E5%B1%9E%E6%80%A7%E8%AF%A6%E6%83%85%E9%9D%A2%E6%9D%BF&width=397 "点击 & 属性详情面板")
All the above functions are atomic components on the GraphInsight platform, which can be freely combined, as shown in the following figure
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402776916-bedeed5f-5016-4e38-8b20-93ec5bf44b57.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=198&id=ub0ebdf04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=467&originWidth=1769&originalType=binary&ratio=1&rotation=0&showTitle=false&size=98860&status=done&style=shadow&taskId=u03d8690b-2b81-4318-895e-e460cf1f8df&title=&width=749)

## 1.3 Canvas Layout

> 5 basic layouts, and supports detailed parameter settings, layout switching, and layout caching.

- ✅ Force Layout
- ✅ Circular Oayout
- ✅ Concentric Circle Layout
- ✅ Radial Layout
- ✅ Directed Hierarchical Layout

## 1.4 Page Layout

> Supports 3 basic layouts of the system, and each layout can freely adjust the placement area, offset, width, height, wether independent DOM, etc.

- ✅ Toolbar: often used to integrate interactive components related to canvas operations, such as zoom in, zoom out, etc.
- ✅ Action bar: often used to integrate analysis components related to business operations, such as data query, algorithm panel, export, save and share, etc.
- ✅ Sidebar: often used to integrate components related to business analysis processes, such as query, filter, style configuration, shortest path, etc.

# ![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778042-9b711d0e-444a-4a7f-a015-7abd3feabf39.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=668&id=kkIwj&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1336&originWidth=2556&originalType=binary&ratio=1&rotation=0&showTitle=false&size=320053&status=done&style=shadow&taskId=ub7d5d2ed-69d9-4238-98b5-ce65bfda55d&title=&width=1278)

# 02.Advance

In the advanced version, the focus is to realize the demands of users to dynamically analyze graphs. Maybe users need to constantly adjust the style, adjust the layout, expand the data, filter the data or save the analysis ideas.

## 2.1 Group Style

- ✅ Nodes and Edges support grouping settings, the system defaults to grouping by "type"
- ✅ Support custom attribute filtering, such as the picture below, you can combine multiple conditions

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402777975-47cad0b3-cb40-4586-b93e-1dd512c6d675.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=423&id=u074552be&margin=%5Bobject%20Object%5D&name=image.png&originHeight=846&originWidth=1611&originalType=binary&ratio=1&rotation=0&showTitle=false&size=154355&status=done&style=shadow&taskId=u4f80a474-835c-40d5-95c3-508c1ebb05c&title=&width=805.5)

## 2.2 Multiple Element Types Rendering

- ✅ In a canvas, there can be many different types of elements, as shown below, rendering a node with a "doughnut" node。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778051-46fbd7a3-39f2-4786-b611-7252bb7ca573.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=328&id=uc0d99a22&margin=%5Bobject%20Object%5D&name=image.png&originHeight=656&originWidth=1115&originalType=binary&ratio=1&rotation=0&showTitle=false&size=109854&status=done&style=shadow&taskId=u8a184c2f-1adf-47f2-a1cd-cf9e5ebed33&title=&width=557.5)

## 2.3 Filter

- ✅ Support attribute field filtering
- ✅ Support filter rule combination
- ✅ Canvas after data filtering: support data change and re-layout
- ✅ Canvas after data filtering: support data unchanged, only highlighted display.
- ✅ Visual display of filtered results: support word cloud, pie chart, line chart, drop-down menu, etc.

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778163-df185d86-4b41-4ad4-81b7-3f210fa6c734.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=575&id=ub1da8676&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1149&originWidth=1913&originalType=binary&ratio=1&rotation=0&showTitle=false&size=251271&status=done&style=shadow&taskId=u1649ad2a-cb11-40ab-a38a-c82bb38f3a8&title=&width=956.5)

## 2.4 Neighbor Diffusion

- ✅ Support integration into right-click menu
- ✅ Support configuration of one-degree, two-degree, and three-degree diffusion
- ✅ Supports customizing data service of diffusion
- ✅ Support different style of diffusion subgraphs.

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402778267-026d23b5-259e-4f7f-99da-5b18d8b612ab.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=481&id=u2cab17c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=961&originWidth=1563&originalType=binary&ratio=1&rotation=0&showTitle=false&size=192817&status=done&style=shadow&taskId=u4867f0dd-ca01-4261-b874-7ed4adb1f71&title=&width=781.5)

## 2.5 Sheetbar

**When there is a "fork" in the analysis idea, you need to add a new canvas to complete the analysis task of the "fork branch" alone**. This work is often done by the canvas tab, the technology is named "Sheetbar", and the inspiration is also the "sheetbar" in traditional Excel.

- ✅ Support adding blank canvas, renaming canvas, deleting canvas
- ✅ Supports selecting elements of the canvas, and then appending them to the new canvas
- ✅ Support completely isolating canvas DOM and communication between tabs 

![home-sheetbar.gif](https://cdn.nlark.com/yuque/0/2022/gif/160133/1653402779133-de2ae334-f92b-45b1-9588-8c5c86af6bdb.gif#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=u50f6a0f0&margin=%5Bobject%20Object%5D&name=home-sheetbar.gif&originHeight=976&originWidth=1404&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&taskId=uab6563e1-dd1f-4fea-a6b0-30be16626e7&title=)

## 2.6 Path Analysis

In network security, you can use "Path Analysis" for host intrusion analysis. In financial risk control, you can use "Path Analysis" to view money laundering paths, and in corporate risk control, you can use "Path Analysis" to view shareholding relationships.

- ✅ Support using pure front-end algorithm for query of paths
- ✅ Support filtering path: shortest path, custom rule filtering
- ✅ Support highlighting path, switching display

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402779896-b6fa4f6e-4765-404d-be64-bb8b2dedff66.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=518&id=u3af9a639&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1036&originWidth=1663&originalType=binary&ratio=1&rotation=0&showTitle=false&size=407652&status=done&style=shadow&taskId=ufd87be08-551e-4897-99f9-a8052a7f464&title=&width=831.5)

# 03.Scene

## 3.1 Geographic Analysis

- ✅ Support the mapping of geographic location fields in the data to "Amap" or "AMap"
- ✅ Supports circled locations in geography to interact with the graph analysis canvas

![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653402779900-99544094-67a6-4f5f-bb3b-039e34f08331.png#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=421&id=u8b28eec0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=842&originWidth=1803&originalType=binary&ratio=1&rotation=0&showTitle=false&size=208631&status=done&style=shadow&taskId=u03877089-11b2-4c0b-aafc-87767ac38fb&title=&width=901.5)

## 3.2 Large Graph Analysis

When there are more than a certain number of nodes, you can start "3D large map rendering". Users can easily see the relationships and gangs that were previously difficult to see on the 2D canvas on the 3D canvas.
![大图.gif](https://cdn.nlark.com/yuque/0/2022/gif/160133/1653402779734-bf7b1404-144b-4f33-b848-3e9da17b2a68.gif#clientId=u806d7510-a1fb-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=ufbb83014&margin=%5Bobject%20Object%5D&name=%E5%A4%A7%E5%9B%BE.gif&originHeight=501&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=shadow&taskId=u53780437-5f3a-41bf-bd02-de5b12224b6&title=)

---

I don’t know if the above list can satisfy your graph analysis business, but we will bring you all the above functions at the **GraphInsight** new product release conference on **June 6** this year. expect!

If you are interested in GraphInsight, welcome to scan the code to join the group:
![image.png](https://cdn.nlark.com/yuque/0/2022/png/160133/1653403059811-870df50f-d519-4723-bddf-88ac24af4647.png#clientId=u9bcfec59-b86b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=416&id=rrC0K&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1280&originWidth=979&originalType=binary&ratio=1&rotation=0&showTitle=false&size=352354&status=done&style=shadow&taskId=u7c01b54b-3b6c-46aa-be51-6555762abb7&title=&width=318)
