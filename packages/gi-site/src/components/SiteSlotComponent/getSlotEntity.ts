import { queryAssets } from '../../services/assets';

let assets;

const getSlotEntity = async (name: string) => {
  if (!assets) {
    const finalAssets = await queryAssets();
    assets = finalAssets;
  }
  const { siteSlots } = assets;
  return siteSlots[name];
};

export default getSlotEntity;
