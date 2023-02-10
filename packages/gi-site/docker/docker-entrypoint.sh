#!/bin/bash

# etcd
if [[ -z "${ETCD_HOSTS}" ]]; then
  # not found, start etcd localy
  # etcd listen on 127.0.0.1:2379 default
  etcd --data-dir /workspace/etcd &> /workspace/etcd/output.log &
fi

# gi site
# listen on 127.0.0.1:7001 default
cd /workspace/graphinsight && npm run start
