import localforage from 'localforage';
import request from 'umi-request';

const getBankCase = async () => {
  const res = await request('https://gw.alipayobjects.com/os/bmw-prod/f9daec5b-4e2e-42e6-9e71-21d0cecb3966.json');
  return {
    ...res,
    id: 'demo-bank',
    type: 'case',
  };
};

const getCloudSecurityCase = async () => {
  const res = await request('https://gw.alipayobjects.com/os/bmw-prod/55424c1c-1da0-4e68-a6a9-c59835fb5ba8.json');
  return {
    ...res,
    id: 'demo-supply-chain',
    type: 'case',
  };
};

const setDefaultDemo = async () => {
  const Bank = await getBankCase();
  const CloudSecurity = await getCloudSecurityCase();
  const Cases = [Bank, CloudSecurity];

  console.log(Cases);

  Cases.forEach(val => {
    localforage.setItem(val.id, val);
  });
};
export default setDefaultDemo;
