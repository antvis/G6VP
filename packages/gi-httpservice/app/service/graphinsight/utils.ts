import { Etcd3 } from 'etcd3';

export const DATASET_PREFIX = 'ds_';
export const WORKBOOK_PREFIX = 'wb_';

const ETCD_HOSTS = process.env.ETCD_HOSTS ? process.env.ETCD_HOSTS : '127.0.0.1:2379';
console.log('ETCD_HOSTS', ETCD_HOSTS);
export const etcd = new Etcd3({
  hosts: ETCD_HOSTS.split(','),
});
