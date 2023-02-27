import { Service } from 'egg';
import { dataset as DATASET_BANK } from './case/bank';
import { IDataset } from './typing';
import { DATASET_PREFIX, etcd } from './utils';

class GIDatasetService extends Service {
  // find case
  async findCase() {
    const cases = [DATASET_BANK];
    // set case in etcd if not exists
    for (const c of cases) {
      const id = c.id;
      console.log('v', id);
      const v = await etcd.get(id).string();
      if (v === null) {
        await etcd.put(id).value(JSON.stringify(c));
      }
    }

    return cases;
  }
  // list dataset
  async list() {
    const dataset: IDataset[] = [];
    const datasetIds = await etcd.getAll().prefix(DATASET_PREFIX).keys();
    for (const id of datasetIds) {
      const v = await etcd.get(id).string();
      const p = JSON.parse(v || '{}');
      dataset.push(p);
    }
    // sort by create time
    dataset.sort((a, b) => {
      return a.gmtCreate - b.gmtCreate;
    });

    return dataset;
  }

  // create dataset
  async create(params) {
    const { id } = params;
    await etcd.put(id).value(JSON.stringify(params));
    return id;
  }

  // get project by id
  async getById(id) {
    const v = await etcd.get(id).string();
    const p = JSON.parse(v || '{}');
    return p;
  }

  // remove project by id
  async removeById(id) {
    await etcd.delete().key(id);
    return true;
  }

  // update project by id
  async updateById(params) {
    const id = params.id;
    const v = await etcd.get(id).string();
    if (v != null) {
      // project found
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, ...params };
      // update
      await etcd.put(id).value(JSON.stringify(new_p));
      return true;
    }
    return false;
  }
}

export default GIDatasetService;
