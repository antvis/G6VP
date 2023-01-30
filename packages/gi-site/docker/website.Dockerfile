# Website for graphinsight

from docker.io/library/node:16

COPY . /root/G6VP

# change the default shell to bash
SHELL ["/bin/bash", "-c"]

# install pnpm
RUN npm install -g pnpm

# download etcd
# see deatil in gi-httpservice/app/service/graphinsight/utils.ts
RUN cd /root && \
  curl -LO https://github.com/etcd-io/etcd/releases/download/v3.4.13/etcd-v3.4.13-linux-amd64.tar.gz && \
  tar zxvf etcd-v3.4.13-linux-amd64.tar.gz && \
  mv etcd-v3.4.13-linux-amd64/etcd /usr/bin/etcd && \
  mv etcd-v3.4.13-linux-amd64/etcdctl /usr/bin/etcdctl && \
  rm -fr etcd-v3.4.13-linux-amd64.tar.gz etcd-v3.4.13-linux-amd64

# gi-httpservice
RUN cd /root/G6VP/packages/gi-httpservice && npm install

# gi-site
RUN cd /root/G6VP/packages/gi-site && pnpm install

# entrypoint
ENTRYPOINT ["/root/G6VP/packages/gi-site/docker/docker-entrypoint.sh"]

