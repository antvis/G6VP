
import params from './GI_CONFIG';
const {GI_ASSETS_PACKAGES} = params;

localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(GI_ASSETS_PACKAGES));

export default {
  ...params,
  id:"demo-bank",
  type: 'case',

};