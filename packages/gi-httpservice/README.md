## GI_STANDALONE_SERVICE

G6VP 的 HTTPServer，用于对接各种引擎，规范查询接口

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Requirement

- Node.js 8.x
- Typescript 2.8+

## Running etcd

- https://etcd.io/docs/v3.5/op-guide/container/

## 安装 etcd docker 镜像

参考官方文档：https://hub.docker.com/r/bitnami/etcd/

docker pull bitnami/etcd

## 启动 ETCD 服务

docker run --rm -it -e ALLOW_NONE_AUTHENTICATION=yes -p 2379:2379 bitnami/etcd
