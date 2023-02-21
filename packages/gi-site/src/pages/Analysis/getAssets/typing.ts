import type { AssetType } from '@antv/gi-sdk';
export interface TypeAssetInfo {
  id: string;
  type: AssetType;
  name: string;
  [key: string]: string;
}
