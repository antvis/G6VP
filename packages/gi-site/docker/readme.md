## 打包镜像

cd gi-site/docker
make // 打包 docker 镜像

## 保存镜像

docker save -o gi-site registry.cn-hongkong.aliyuncs.com/graphinsight/website:latest

## 上传镜像

scp gi-site root@x.x.x.x:/

## 登陆到计算巢

ssh root@x.x.x.x

## 进入到 gi-site docker 中，启动服务

docker run --rm -it -p 9999:9999 registry.cn-hongkong.aliyuncs.com/graphinsight/website:latest /bin/sh

cd /work/dist && python3 -m http.server 9999
