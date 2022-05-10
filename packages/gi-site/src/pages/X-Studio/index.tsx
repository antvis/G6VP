import localforage from 'localforage';
import AML from './AML';
import Bank from './Bank';
import CloudSecurity from './CloudSecurity';
import Enterprise from './Enterprise';
import Paris from './Paris';
const Cases = [Bank, Paris, CloudSecurity, Enterprise, AML];
const setDefaultDemo = () => {
  Cases.forEach(val => {
    localforage.setItem(val.id, val);
  });
};
export default setDefaultDemo;
