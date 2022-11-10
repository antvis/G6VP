# /usr/src/graph_vis_service/Dockerfile
FROM node:16.17.0

# 在容器中创建一个目录
RUN mkdir -p /usr/src/graph_vis_service/

# 定位到容器的工作目录
WORKDIR /usr/src/graph_vis_service/

# RUN/COPY 是分层的，package.json 提前，只要没修改，就不会重新安装包
COPY package.json /usr/src/graph_vis_service/package.json
RUN cd /usr/src/graph_vis_service/
RUN npm i

# 把当前目录下的所有文件拷贝到 Image 的 /usr/src/nodejs/ 目录下
COPY . /usr/src/graph_vis_service/

EXPOSE 30010