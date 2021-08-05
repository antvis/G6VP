import request from 'umi-request';
import { BrowserFSFileType } from '@alipay/alex-core';

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

// const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7001';
const SERVICE_URL_PREFIX = 'http://storehouse-afx-18554.gz00b.dev.alipay.net';

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

interface DirectoryBlob {
  projectName: string;
  branchName: string;
  path: string;
}
/**
 * 根据项目名称、分支名称及路径查询目录结构
 * @param param
 */
export const getFileDirectory = async (param: DirectoryBlob) => {
  const { projectName, branchName, ...others } = param;
  return request(`${SERVICE_URL_PREFIX}/asset/repository/${projectName}/${branchName}`, {
    method: 'get',
    params: others,
  })
    .then(response => {
      const { result } = response;
      // 拼接成 Alex 要求的格式
      const arr: string[][] = [];
      result.forEach(item => {
        arr.push([item.name, item.type === 'blob' ? BrowserFSFileType.FILE : BrowserFSFileType.DIRECTORY]);
      });

      return {
        data: {
          [param.path ? param.path : '/']: arr,
        },
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
 * 根据项目名称、分支名称及路径查询文件内容
 * @param param
 */
export const getFileBlob = async (param: DirectoryBlob) => {
  const { projectName, branchName, ...others } = param;
  return request(`${SERVICE_URL_PREFIX}/asset/blob/${projectName}/${branchName}`, {
    method: 'get',
    params: others,
  })
    .then(response => {
      const { result } = response;
      debugger;
      return {
        data: result,
        success: true,
        errorMsg: null,
      };
    })
    .catch(error => {
      debugger;
      return {
        data: null,
        success: false,
        errorMsg: error,
      };
    });
};
