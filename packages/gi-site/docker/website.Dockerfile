# Website for graphinsight

from docker.io/library/node:16

COPY . /workspace/G6VP

# change the default shell to bash
SHELL ["/bin/bash", "-c"]

# install pnpm
RUN npm install -g pnpm

# download etcd
# see deatil in gi-httpservice/app/service/graphinsight/utils.ts
RUN cd /tmp && \
  curl -LO https://github.com/etcd-io/etcd/releases/download/v3.4.13/etcd-v3.4.13-linux-amd64.tar.gz && \
  tar zxvf etcd-v3.4.13-linux-amd64.tar.gz && \
  mv etcd-v3.4.13-linux-amd64/etcd /usr/bin/etcd && \
  mv etcd-v3.4.13-linux-amd64/etcdctl /usr/bin/etcdctl && \
  rm -fr etcd-v3.4.13-linux-amd64.tar.gz etcd-v3.4.13-linux-amd64

# install deps
RUN  pnpm install

# gi-httpservice
RUN cd /workspace/G6VP/packages/gi-httpservice && npm install
# build dist files 
RUN npm run docker 

# gi-site
RUN cd /workspace/G6VP/packages/gi-site
# build dist files 
RUN npm run build:docker 

## copy gi-site files to gi-httpservice
RUN cp /workspace/G6VP/packages/gi-site/dist/index.html /workspace/G6VP/packages/gi-httpservice/app/view/index.html 
RUN cp -r /workspace/G6VP/packages/gi-site/dist/* /workspace/G6VP/packages/gi-httpservice/app/public/


RUN mkdir -p /workspace/graphinsight 
RUN cp -r /workspace/G6VP/packages/gi-httpservice/ /workspace/graphinsight/


# workspace
RUN mkdir -p /workspace/etcd

# entrypoint
ENTRYPOINT ["/workspace/G6VP/packages/gi-site/docker/docker-entrypoint.sh"]

