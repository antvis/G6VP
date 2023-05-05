import { Service } from 'egg';

import { IDataset } from './typing';
import { DATASET_PREFIX, etcd, WORKBOOK_PREFIX } from './utils';

class GIDatasetService extends Service {
  // find case
  async findCase() {
    const cases = [];
    // set case in etcd if not exists
    // for (const c of cases) {
    //   const id = c.id;
    //   const v = await etcd.get(id).string();
    //   if (v === null) {
    //     await etcd.put(id).value(JSON.stringify(c));
    //   }
    // }
    return cases;
  }
  // list dataset
  async list() {
    const dataset: IDataset[] = [];
    const datasetIds = await etcd.getAll().prefix(DATASET_PREFIX).keys();
    for (const id of datasetIds) {
      const v = await etcd.get(id).string();
      const p = JSON.parse(v || '{}');
      // not in recycling status
      if (!p.recycleTime) dataset.push(p);
    }
    // sort by create time
    dataset.sort((a, b) => {
      return a.gmtCreate - b.gmtCreate;
    });

    return dataset;
  }

  // list the datasets in recycling status, and remove the expired datasets in the same time
  async listRecycles() {
    const dataset: IDataset[] = [];
    const datasetIds = await etcd.getAll().prefix(DATASET_PREFIX).keys();
    for (const id of datasetIds) {
      const v = await etcd.get(id).string();
      const p = JSON.parse(v || '{}');
      const { recycleTime } = p;
      // in recycling status
      if (recycleTime) {
        const expired = new Date().getTime() - recycleTime > 604800000;
        if (expired) {
          this.removeById(id);
        } else {
          dataset.push(p);
        }
      }
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

  // get dataset by id
  async getById(id) {
    const v = await etcd.get(id).string();
    const p = JSON.parse(v || '{}');
    return p;
  }

  // remove dataset by id
  async removeById(id) {
    await etcd.delete().key(id);
    // remove related projects
    const projectIDs = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
    for (const pid of projectIDs) {
      const v = await etcd.get(pid).string();
      const p = JSON.parse(v || '{}');
      const { type, datasetId } = p;
      if (type === 'project' && datasetId === id) {
        await etcd.delete().key(pid);
      }
    }
    return true;
  }

  // tag the dataset with recycleTime to indicate the dataset is in recycling status
  async recycleById(id) {
    const v = await etcd.get(id).string();
    if (v != null) {
      const recycleTime = new Date().getTime();
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, recycleTime };
      await etcd.put(id).value(JSON.stringify(new_p));
      // recycle related projects
      const projectIDs = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
      for (const pid of projectIDs) {
        const pv = await etcd.get(pid).string();
        const project = JSON.parse(pv || '{}');
        const { type, datasetId } = project;
        if (type === 'project' && datasetId === id) {
          const new_project = { ...project, recycleTime };
          await etcd.put(pid).value(JSON.stringify(new_project));
        }
      }
      return true;
    }
    return false;
  }

  // recover the dataset by remove the recycleTime tag
  async recoverById(id) {
    const v = await etcd.get(id).string();
    if (v != null) {
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, recycleTime: undefined };
      await etcd.put(id).value(JSON.stringify(new_p));
      // recover related projects
      const projectIDs = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
      for (const pid of projectIDs) {
        const pv = await etcd.get(pid).string();
        const project = JSON.parse(pv || '{}');
        const { type, datasetId } = project;
        if (type === 'project' && datasetId === id) {
          const new_project = { ...project, recycleTime: undefined };
          await etcd.put(pid).value(JSON.stringify(new_project));
        }
      }
      return true;
    }
    return false;
  }

  // update dataset by id
  async updateById(params) {
    const id = params.id;
    const v = await etcd.get(id).string();
    if (v != null) {
      // dataset found
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
