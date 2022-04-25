import localforage from 'localforage';
import Bank from './Bank';
import CloudSecurity from './CloudSecurity';
import Paris from './Paris';

const Cases = [Bank, Paris, CloudSecurity];
const setDefaultDemo = () => {
  Cases.forEach(val => {
    localforage.setItem(val.id, val);
  });
};
export default setDefaultDemo;
