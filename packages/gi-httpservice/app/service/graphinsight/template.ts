import { Service } from 'egg';

import { ITemplate } from './typing';
import { TEMPLATE_PREFIX, WORKBOOK_PREFIX, etcd } from './utils';

class TemplateService extends Service {
  async list() {
    const template: ITemplate[] = [];
    const templateIds = await etcd.getAll().prefix(TEMPLATE_PREFIX).keys();
    for (const id of templateIds) {
      const v = await etcd.get(id).string();
      const p = JSON.parse(v || '{}');
      template.push(p);
    }
    // sort by create time
    template.sort((a, b) => {
      // @ts-ignore
      return a.gmtCreate - b.gmtCreate;
    });

    return template;
  }

  // create template
  async create(params) {
    const { id } = params;
    await etcd.put(id).value(JSON.stringify(params));
    return id;
  }

  // get template by id
  async getById(id) {
    const v = await etcd.get(id).string();
    const p = JSON.parse(v || '{}');
    return p;
  }

  // remove template by id
  async removeById(id) {
    await etcd.delete().key(id);
    // remove related projects
    const ids = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
    for (const pid of ids) {
      const v = await etcd.get(pid).string();
      const p = JSON.parse(v || '{}');
      const { type, datasetId } = p;
      if (type === 'project' && datasetId === id) {
        await etcd.delete().key(pid);
      }
    }
    return true;
  }

  // tag the template with recycleTime to indicate the template is in recycling status
  async recycleById(id) {
    const v = await etcd.get(id).string();
    if (v != null) {
      const recycleTime = new Date().getTime();
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, recycleTime };
      await etcd.put(id).value(JSON.stringify(new_p));
      // recycle related projects
      const ids = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
      for (const pid of ids) {
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

  // recover the template by remove the recycleTime tag
  async recoverById(id) {
    const v = await etcd.get(id).string();
    if (v != null) {
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, recycleTime: undefined };
      await etcd.put(id).value(JSON.stringify(new_p));
      // recover related projects
      const ids = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
      for (const pid of ids) {
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

  // update template by id
  async updateById(params) {
    const id = params.id;
    const v = await etcd.get(id).string();
    if (v != null) {
      // template found
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, ...params };
      // update
      await etcd.put(id).value(JSON.stringify(new_p));
      return true;
    }
    return false;
  }
}

export default TemplateService;
