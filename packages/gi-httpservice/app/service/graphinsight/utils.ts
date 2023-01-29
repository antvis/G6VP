import { Etcd3 } from 'etcd3';

export const ETCD_PREFIX = 'graphinsight';

export const etcd = new Etcd3({
  hosts: process.env.ETCD_HOSTS!.split(',')
});

export const getUid = () => {
  return `${ETCD_PREFIX}-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
       v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

