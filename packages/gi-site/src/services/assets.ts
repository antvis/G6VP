import request from 'umi-request';
import { BrowserFSFileType } from '@alipay/alex-core';

interface CreateAssetParams {
  displayName: string;
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
  branchName: string;
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

interface BranchParams {
  projectName: string;
  branchName: string;
  refBranchName: string;
}

const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7001';
// const SERVICE_URL_PREFIX = 'http://storehouse-afx-18554.gz00b.dev.alipay.net';

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
 * 资产中心 service 文件
 */
export const createAssets = async (param: CreateAssetParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/create`, {
    method: 'post',
    data: param,
  });

  return convertResponse(response);
};

export const updateAssets = async (id: string, param: UpdateAssetParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/update/${id}`, {
    method: 'post',
    data: param,
  });

  return convertResponse(response);
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
  return convertResponse(response);
};

/**
 * 根据项目名称、分支名称及路径查询目录结构
 * @param param
 */
export const getFileDirectory = async (param: DirectoryBlob) => {
  const { projectName, branchName, ...others } = param;
  const response = await request(`${SERVICE_URL_PREFIX}/asset/repository/${projectName}/${branchName}`, {
    method: 'get',
    params: others,
  });

  const { data = [], success, errorMsg } = response as any;
  // 拼接成 Alex 要求的格式
  const arr: string[][] = [];
  data.forEach(item => {
    arr.push([item.name, item.type === 'blob' ? BrowserFSFileType.FILE : BrowserFSFileType.DIRECTORY]);
  });

  let msg = errorMsg;
  if (!success && data.message) {
    msg = `${errorMsg}:${data.message}`;
  }
  return {
    data: {
      [param.path ? param.path : '/']: arr,
    },
    success,
    errorMsg: msg,
  };
};

/**
 * 根据项目名称、分支名称及路径查询文件内容
 * @param param
 */
export const getFileBlob = async (param: DirectoryBlob) => {
  const { projectName, branchName, ...others } = param;
  const response = await request(`${SERVICE_URL_PREFIX}/asset/blob/${projectName}/${branchName}`, {
    method: 'get',
    params: others,
  });

  return convertResponse(response);
};

export const updateFileContent = async (fileParams: FilrParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/updatefile`, {
    method: 'put',
    data: fileParams,
  });

  return convertResponse(response);
};

/**
 * 以文本的形式获取指定路径下文件的源代码
 * @param fileParams
 */
export const getFileSourceCode = async (fileParams: DirectoryBlob) => {
  const { projectName, branchName, path } = fileParams;
  const response = await request(`${SERVICE_URL_PREFIX}/asset/sourcecode/${projectName}/${branchName}`, {
    method: 'get',
    params: {
      path,
    },
  });

  return convertResponse(response);
};

/**
 * 以文本的形式获取指定路径下文件的源代码
 * @param fileParams
 */
export const createNewBranch = async (branchParams: BranchParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/createbranch`, {
    method: 'post',
    data: branchParams,
  });

  return convertResponse(response);
};

/**
 * 在 AntCode 上创建项目
 * @param projectParams 创建项目的参数
 */
export const createNewProjectOnAntCode = async projectParams => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/createproject`, {
    method: 'post',
    data: projectParams,
  });

  return convertResponse(response);
};
