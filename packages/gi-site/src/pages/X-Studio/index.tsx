import localforage from 'localforage';
import request from 'umi-request';

const getBankCase = async () => {
  const res = await request('https://gw.alipayobjects.com/os/bmw-prod/f9daec5b-4e2e-42e6-9e71-21d0cecb3966.json');
  const { GI_ASSETS_PACKAGES } = res;
  localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(GI_ASSETS_PACKAGES));
  return {
    ...res,
    id: 'demo-bank',
    type: 'case',
  };
};

const getCloudSecurityCase = async () => {
  const res = await request('https://gw.alipayobjects.com/os/bmw-prod/58fb60f9-b66d-4a82-856b-af1a90265f5c.json');
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
