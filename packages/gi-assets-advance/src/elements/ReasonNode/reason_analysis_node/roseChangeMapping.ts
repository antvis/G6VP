import { IChangeItem } from './interface';

export default class RoseChangeMapping {
  private map: Map<string, number>;

  private static instance: RoseChangeMapping;

  private constructor() {
    this.map = new Map();
  }

  public resetMap() {
    this.map = new Map();
  }

  public static getInstance() {
    if (!RoseChangeMapping.instance) {
      RoseChangeMapping.instance = new RoseChangeMapping();
    }
    return RoseChangeMapping.instance;
  }

  public setMappingData(changes: Array<IChangeItem>) {
    changes.forEach(change => {
      const { beforeValue, props, name: nameBefore } = change;

      props.forEach(prop => {
        const { name, unit, value } = prop;
        const limit = Math.max(this.map.get(name) ?? 0, Math.abs(value));
        this.map.set(name, limit);
        if (nameBefore === name) {
          const limit = Math.max(this.map.get(name) ?? 0, Math.abs(beforeValue ?? 0));
          this.map.set(name, limit);
        }
      });
    });
  }

  public getMappingData() {
    return this.map;
  }
}
