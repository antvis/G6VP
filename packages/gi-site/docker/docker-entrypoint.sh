#!/bin/bash

# etcd
if [[ -z "${ETCD_HOSTS}" ]]; then
  # not found, start etcd localy
  # etcd listen on 127.0.0.1:2379 default
  etcd --data-dir /workspace/etcd &> /workspace/etcd/output.log &
fi

# gi httpservice
# listen on 127.0.0.1:7001 default
cd /workspace/G6VP/packages/gi-httpservice
npm run dev &> /workspace/gihttpservice/output.log &

# gi site
# listen on 127.0.0.1:8000 default
cd /workspace/G6VP/packages/gi-site
npm run start

