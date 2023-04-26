import localforage from 'localforage';
import { getUid } from '../pages/Workspace/utils';
import { IProject } from '../services/typing';

export const GI_PROJECT_DB = localforage.createInstance({
  name: 'gi-project',
});

export const GI_DATASET_DB = localforage.createInstance({
  name: 'gi-dataset',
});
export const GI_TEMPLATE_DB = localforage.createInstance({
  name: 'gi-template',
});
//@ts-ignore
window.GI_PROJECT_DB = GI_PROJECT_DB;
//@ts-ignore
window.GI_DATASET_DB = GI_DATASET_DB;
//@ts-ignore
window.GI_TEMPLATE_DB = GI_DATASET_DB;

const useUpdate = async () => {
  try {
    const databases = await indexedDB.databases();
    const isLatest =
      databases.filter(item => {
        return item.name == 'gi-project' || item.name === 'gi-dataset';
      }).length === 2;

    if (!isLatest) {
      console.log('旧版本的数据库，需要升级');

      localforage.iterate((item: IProject) => {
        //@ts-ignore
        const { id, engineId, engineContext, data, schemaData, ...others } = item;
        const datasetId = `ds_${getUid()}`;
        if (id) {
          GI_PROJECT_DB.setItem(id, { ...others, id, datasetId });
        }
        GI_DATASET_DB.setItem(datasetId, {
          id: datasetId,
          type: 'user',
          engineId,
          engineContext,
          data,
          schemaData,
        });
      });

      await GI_PROJECT_DB.ready();
      await GI_DATASET_DB.ready();
      await localforage.dropInstance({ name: 'localforage' });
    }
  } catch (error) {
    console.error(error);
  }
};
export default useUpdate;
