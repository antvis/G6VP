import { IBizIdentifieBucket } from './interface';

export default class BizIdentifiedMapping {
  private map: Map<string, Array<string>>;

  private static instance: BizIdentifiedMapping;

  private constructor() {
    this.map = new Map();
  }

  public static getInstance() {
    if (!BizIdentifiedMapping.instance) {
      BizIdentifiedMapping.instance = new BizIdentifiedMapping();
    }
    return BizIdentifiedMapping.instance;
  }

  public setMappingData(bizIdentifieBucket: IBizIdentifieBucket) {
    this.map = new Map();
    Object.keys(bizIdentifieBucket ?? {}).forEach(quota => {
      this.map.set(quota, bizIdentifieBucket[quota]);
    });
  }

  public getMappingData() {
    return this.map;
  }
}
