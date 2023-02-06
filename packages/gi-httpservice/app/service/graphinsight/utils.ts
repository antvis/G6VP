import { Etcd3 } from 'etcd3';

export const ETCD_PREFIX = 'graphinsight';

const ETCD_HOSTS = process.env.ETCD_HOSTS ? process.env.ETCD_HOSTS : '127.0.0.1:2379';
console.log('ETCD_HOSTS', ETCD_HOSTS);
export const etcd = new Etcd3({
  hosts: ETCD_HOSTS.split(','),
});

export const getUid = () => {
  return `${ETCD_PREFIX}-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
