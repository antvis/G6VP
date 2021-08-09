// /** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
// import * as ComponentAssets from '@alipay/graphinsight/es/components';
// import * as ElementAssets from '@alipay/graphinsight/es/elements';
import assets from '@alipay/gi-assets';
import request from 'umi-request';

const { components, elements } = assets;

const isLocal = true;

/** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const queryAssets = async (id: string) => {
  if (isLocal) {
    return await new Promise(resolve => {
      resolve({
        components: components,
        elements: elements,
      });
    });
  }
  return await request('api:queryAllAssets');
};
