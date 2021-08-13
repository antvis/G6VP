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

interface DirectoryBlob {
  projectName: string;
  branchName: string;
  path: string;
}

interface FilrParams extends DirectoryBlob {
  content: string;
  commitMsg: string;
}

const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7001';
// const SERVICE_URL_PREFIX = 'http://storehouse-afx-18554.gz00b.dev.alipay.net';

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

const convertResponse = response => {
  const { data, success, errorMsg } = response;
  let msg = errorMsg;
  if (!success && data.message) {
    msg = `${errorMsg}:${data.message}`;
  }
  return {
    data,
    success,
    errorMsg: msg,
  };
};

/**
 * 查询资产列表
 * @param param 查询参数
 */
export const queryAssetList = async (param?: { name?: string; limit?: number }) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/list`, {
    method: 'get',
    params: param,
  });

  return convertResponse(response);
};

/**
 * 根据资产 ID 查询资产
 * @param id 资产 ID
 */
export const queryAssetById = async (id: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/list/${id}`, {
    method: 'GET',
  });
  debugger;
  return convertResponse(response);
};

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
      const { data = [] } = response;
      // 拼接成 Alex 要求的格式
      const arr: string[][] = [];
      data.forEach(item => {
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
      const { data, success, errorMsg } = response;
      return {
        data,
        success,
        errorMsg,
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

export const updateFileContent = async (fileParams: FilrParams) => {
  return request(`${SERVICE_URL_PREFIX}/asset/updatefile`, {
    method: 'put',
    data: fileParams,
  })
    .then(response => {
      const { data, success, errorMsg } = response;
      return {
        data,
        success,
        errorMsg,
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
 * 以文本的形式获取指定路径下文件的源代码
 * @param fileParams
 */
export const getFileSourceCode = async (fileParams: DirectoryBlob) => {
  const { projectName, branchName, path } = fileParams;
  return request(`${SERVICE_URL_PREFIX}/asset/sourcecode/${projectName}/${branchName}`, {
    method: 'get',
    params: {
      path,
    },
  })
    .then(response => {
      const { data, success, errorMsg } = response;
      return {
        data,
        success,
        errorMsg,
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

interface BranchParams {
  projectName: string;
  branchName: string;
  refBranchName: string;
}

/**
 * 以文本的形式获取指定路径下文件的源代码
 * @param fileParams
 */
export const createNewBranch = async (branchParams: BranchParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/createBranch`, {
    method: 'post',
    data: branchParams,
  });

  const { data, success, errorMsg } = response;
  let msg = errorMsg;
  if (!success) {
    msg = `${errorMsg}:${data.message}`;
  }
  return {
    data,
    success,
    errorMsg: msg,
  };
};
