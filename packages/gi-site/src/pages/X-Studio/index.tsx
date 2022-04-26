import localforage from 'localforage';
import Bank from './Bank';
import CloudSecurity from './CloudSecurity';
import Paris from './Paris';
import Enterprise from './Enterprise'

const Cases = [Bank, Paris, CloudSecurity, Enterprise];
const setDefaultDemo = () => {
  Cases.forEach(val => {
    localforage.setItem(val.id, val);
  });
};
export default setDefaultDemo;
