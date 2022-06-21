import localforage from 'localforage';
import Bank from './Bank';
import CloudSecurity from './CloudSecurity';
import Enterprise from './Enterprise';

const Cases = [Bank, CloudSecurity, Enterprise];
const setDefaultDemo = () => {
  Cases.forEach(val => {
    localforage.setItem(val.id, val);
  });
};
export default setDefaultDemo;
