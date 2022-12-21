## G6VP 站点服务

G6VP 作为开源产品，为了用户的数据安全考虑，我们将站点数据全部存储在用户浏览器本地（IndexedDB），同时为了对内提供更良好的服务，我们在站内采用 ：Chair + OceanBase 的服务。

- 本地站点服务：IndexDB

  - 获取项目的列表:[GET] api/project/list
  - 项目的创建:[POST] api/project/create
  - 项目的删除:[POST] api/project/delete
  - 项目的更新:[POST] api/project/update
  - 获取项目详情:[POST] api/project/id

- 对内备份服务：Chair + OceanBase

  - 本地项目，数据自动备份到服务端: api/project
  - 权限设置，包括分享权限

- 图算法服务：GraphScope
- 图推荐服务：AVA
- 图存储服务：暂时不做
