## 下载最新镜像

```bash
docker pull antvis/gi-site:latest
```

## 本地构建镜像

```bash
cd G6VP
docker build -t antvis/gi-site:latest -f packages/gi-site/docker/website.Dockerfile --network=host .
```

### 保存镜像

```bash
docker save -o gi-site antvis/gi-site:latest
```

### 上传镜像

```bash
scp gi-site root@x.x.x.x:/
```

### 登陆到计算巢，并载入镜像
```bash
ssh root@x.x.x.x:
docker load < gi-site
```

## 启动 gi-site 服务

```bash
docker run --name gi-site -d --rm -p 8000:8000 antvis/gi-site:latest
```

