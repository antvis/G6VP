import { Etcd3 } from 'etcd3';

export const ETCD_PREFIX = 'graphinsight';

const ETCD_HOST = process.env.ETCD_HOST ? process.env.ETCD_HOST : '127.0.0.1:2379' 
export const etcd = new Etcd3({
  hosts: ETCD_HOSTS.split(',')
});

export const getUid = () => {
  return `${ETCD_PREFIX}-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
       v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

