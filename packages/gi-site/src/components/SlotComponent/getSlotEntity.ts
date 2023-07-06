import { queryAssets } from '../../services/assets';
import type { GIAssets, ISiteSlot } from '@antv/gi-sdk/es/typing';

let assets: GIAssets;

const getSlotEntityById = (slots: GIAssets['siteSlots'], id: string) => {
  let slotEntity;
  Object.keys(slots).forEach((key) => {
    if (slots[key].id === id) {
      slotEntity = slots[key];
    }
  });
  return slotEntity;
}

const getSlotEntity = async (name: string): Promise<ISiteSlot> => {
  if (!assets) {
    const finalAssets = await queryAssets();
    assets = finalAssets;
  }
  const { siteSlots = {} } = assets;
  return siteSlots[name] || getSlotEntityById(siteSlots, name);
};

export default getSlotEntity;
