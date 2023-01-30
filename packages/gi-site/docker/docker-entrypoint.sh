#!/bin/bash

# G6VP dir
readonly G6VP_DIR="/root/G6VP"

# runtime dir
readonly RUNTIME_DIR="/root/runtime"
mkdir -p ${RUNTIME_DIR}

# etcd
if [[ -z "${ETCD_HOSTS}" ]]; then
  # not found, start etcd localy
  mkdir -p ${RUNTIME_DIR}/etcd
  # etcd listen on 127.0.0.1:2379 default
  etcd --data-dir ${RUNTIME_DIR}/etcd &> ${RUNTIME_DIR}/etcd/output.log &
fi

# gi httpservice
# listen on 127.0.0.1:7001 default
cd ${G6VP_DIR}/packages/gi-httpservice
mkdir -p ${RUNTIME_DIR}/gihttpservice
npm run dev &> ${RUNTIME_DIR}/gihttpservice/output.log &

# gi site
# listen on 127.0.0.1:8000 default
cd ${G6VP_DIR}/packages/gi-site
npm run start

