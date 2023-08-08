import { queryAssets } from '../../services/assets';
import type { GIAssets, ISiteSlot } from '@antv/gi-sdk/es/typing';
import { utils } from '@antv/gi-sdk';

const { getSiteContext } = utils;

let assets: GIAssets;

const getSiteSlots = (slots: GIAssets['slots'] = {}) => {
  const { GI_SITE_ID } = getSiteContext();
  const siteslots = Object.fromEntries(
    Object.keys(slots)
      // 插槽 siteId 与 站点上下文信息匹配
      .filter(key => slots[key].siteId === GI_SITE_ID)
      .map(key => [key, slots[key]])
  );

  return siteslots;
}

const getSlotEntityById = (slots: GIAssets['slots'] = {}, id: string) => {
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

  const slots= getSiteSlots(assets?.slots || {});
  return slots[name] || getSlotEntityById(slots, name);
};

export default getSlotEntity;
