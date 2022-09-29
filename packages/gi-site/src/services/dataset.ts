import { GraphSchemaData } from '@alipay/graphinsight';
import { GraphinData } from '@antv/graphin';
import { DB_DATASETS, IS_LOCAL_ENV } from './const';
export interface DataSet {
  engineId: string;
  data: GraphinData;
  schemaData: GraphSchemaData;
}
export const queryDataset = async () => {
  const dataset: DataSet[] = [];
  if (IS_LOCAL_ENV) {
    await DB_DATASETS.iterate((val: DataSet) => {
      dataset.push(val);
    });
    return dataset.filter(c => c.data);
  }
  return [];
};
