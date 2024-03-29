import { Service } from 'egg';

import { IProject } from './typing';
import { etcd, WORKBOOK_PREFIX } from './utils';

class GIProjectService extends Service {
  // find case
  async findCase() {
    const cases = [];
    // set case in etcd if not exists
    // for (const c of cases) {
    //   const id = c.id;
    //   console.log('v', id);
    //   const v = await etcd.get(id).string();

    //   if (v === null) {
    //     await etcd.put(id).value(JSON.stringify(c));
    //   }
    // }
    return cases;
  }

  // list project
  async listProject() {
    const projects: IProject[] = [];

    // get projects from etcd
    const projectIDs = await etcd.getAll().prefix(WORKBOOK_PREFIX).keys();
    for (const id of projectIDs) {
      const v = await etcd.get(id).string();
      const p = JSON.parse(v || '{}');
      const { type, recycleTime } = p;
      if (type === 'project') {
        let isExpired = false;
        if (recycleTime) isExpired = new Date(recycleTime + 604800000).getTime() < new Date().getTime();
        if (isExpired) this.removeProjectById(String(id));
        else projects.push(p);
      }
    }

    // sort by create time
    projects.sort((a, b) => {
      return a.gmtCreate - b.gmtCreate;
    });

    return projects;
  }

  // create project
  async createProject(params) {
    params.id = `${WORKBOOK_PREFIX}${params.id}`;
    const { id } = params;
    await etcd.put(id).value(JSON.stringify(params));
    return id;
  }

  // get project by id
  async getProjectById(projectID) {
    const v = await etcd.get(projectID).string();
    const p = JSON.parse(v || '{}');
    return p;
  }

  // remove project by id
  async removeProjectById(projectID) {
    await etcd.delete().key(projectID);
    return true;
  }

  // update project by id
  async updateProjectById(params) {
    const projectID = params.id;
    const v = await etcd.get(projectID).string();
    if (v != null) {
      // project found
      const p = JSON.parse(v || '{}');
      const new_p = { ...p, ...params };
      // update
      await etcd.put(projectID).value(JSON.stringify(new_p));
      return true;
    }
    return false;
  }
}

export default GIProjectService;
