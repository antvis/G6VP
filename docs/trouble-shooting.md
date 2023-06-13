## 01. Neo4j 无法连接的问题

打开浏览器控制台，发现提示：

```code
index.min.js:2  Uncaught (in promise) Neo4jError: Could not perform discovery. No routing servers available. Known routing table: RoutingTable[database=default database, expirationTime=0, currentTime=1684894472539, routers=[], readers=[], writers=[]]
```

根据 Neo4j 官方排错文档介绍：https://aura.support.neo4j.com/hc/en-us/articles/5290730835859--Could-not-perform-discovery-No-routing-servers-available-while-connecting-to-an-AuraDB-instance-from-Neo4j-browser

## 02.
