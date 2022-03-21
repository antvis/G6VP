import localforage from 'localforage';
import CloudSecurity from './CloudSecurity';

const setDefaultDemo = () => {
  localforage.setItem(CloudSecurity.id, CloudSecurity);
};
export default setDefaultDemo;
