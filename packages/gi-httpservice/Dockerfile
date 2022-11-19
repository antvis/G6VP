# /usr/src/gi-httpservice/Dockerfile
FROM node:16.17.0

# 在容器中创建一个目录
RUN mkdir -p /usr/src/gi-httpservice/

# 定位到容器的工作目录
WORKDIR /usr/src/gi-httpservice/

# RUN/COPY 是分层的，package.json 提前，只要没修改，就不会重新安装包
COPY package.json /usr/src/gi-httpservice/package.json
RUN cd /usr/src/gi-httpservice/
RUN npm i

# 把当前目录下的所有文件拷贝到 Image 的 /usr/src/nodejs/ 目录下
COPY . /usr/src/gi-httpservice/

EXPOSE 30010