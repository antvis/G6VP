import localforage from 'localforage';
import request from 'umi-request';

const getBankCase = async () => {
  const res = await request('https://gw.alipayobjects.com/os/bmw-prod/8485df2e-74a2-4f2c-acd1-043b8e6cc60c.json');
  return {
    ...res,
    id: 'demo-bank',
    type: 'case',
  };
};

const getCloudSecurityCase = async () => {
  const res = await request('https://gw.alipayobjects.com/os/bmw-prod/6567a4be-4552-4d95-960d-420d3a48fba0.json');
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
