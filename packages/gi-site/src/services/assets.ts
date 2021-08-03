import request from 'umi-request';

interface CreateAssetParams {
  name: string;
  sourceCodeUrl?: string;
  members?: string;
  distCodeUrl?: string;
  yuyanBuildId?: string;
  yuyanAssetsId?: string;
  publicLevel?: number;
  tag?: number;
  status?: number;
  forkFrom?: string;
  version: string;
  description?: string;
  type: number;
  meta?: string;
  ownerNickname: string;
  ownerId: string;
}

interface UpdateAssetParams extends CreateAssetParams {
  id?: string;
}

const SERVICE_URL_PREFIX = 'http://storehouse-afx-18554.gz00b.dev.alipay.net'; //'http://dev.alipay.net:7001';

/**
 * 资产中心 service 文件
 */
export const createAssets = async (param: CreateAssetParams) => {
  return request(`${SERVICE_URL_PREFIX}/asset/create`, {
    method: 'post',
    data: param,
  })
    .then(response => {
      const { result } = response;
      return {
        data: result,
        success: true,
        errorMsg: null,
      };
    })
    .catch(error => {
      return {
        data: null,
        success: false,
        errorMsg: error,
      };
    });
};

export const updateAssets = async (id: string, param: UpdateAssetParams) => {
  return request(`${SERVICE_URL_PREFIX}/asset/update/${id}`, {
    method: 'post',
    data: param,
  })
    .then(response => {
      const { result } = response;
      return {
        data: result,
        success: true,
        errorMsg: null,
      };
    })
    .catch(error => {
      return {
        data: null,
        success: false,
        errorMsg: error,
      };
    });
};

/**
 * 查询资产列表
 * @param param 查询参数
 */
export const queryAssetList = async (param?: { name?: string; limit?: number }) => {
  return request(`${SERVICE_URL_PREFIX}/asset/list`, {
    method: 'get',
    params: param,
  })
    .then(response => {
      const { result } = response;
      return {
        data: result,
        success: true,
        errorMsg: null,
      };
    })
    .catch(error => {
      return {
        data: null,
        success: false,
        errorMsg: error,
      };
    });
};
