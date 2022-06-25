// import { BrowserFSFileType } from '@alipay/alex';
const BrowserFSFileType = {
  FILE: '',
  DIRECTORY: '',
};
import request from 'umi-request';
import { getCombinedAssets } from '../loader';
import { IS_LOCAL_ENV, SERVICE_URL_PREFIX } from './const';

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
  branchName: string;
  projectId?: string;
  sourceCode?: string;
}

interface UpdateAssetParams {
  id?: string;
  buildLogUrl?: string;
  yuyanBuildId?: string;
  version: string;
  status: number;
}

interface BaseParams {
  projectName: string;
  branchName: string;
}

interface DirectoryBlob extends BaseParams {
  path: string;
}

interface FilrParams extends DirectoryBlob {
  content: string;
  commitMsg: string;
}

interface BranchParams extends BaseParams {
  refBranchName: string;
}

interface BuildParams extends BaseParams {
  assetId: string;
}

interface ActiveAssetParams {
  name: string;
  version: string;
}

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
  if (IS_LOCAL_ENV) {
    return new Promise(resolve => {
      resolve({
        success: true,
      });
    });
  }
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
 * 通过选中的资产名称和版本查询资产列表
 * @param param 选中的资产列表
 */
export const queryActiveAssetList = async (param: ActiveAssetParams[]) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/activelist`, {
    method: 'post',
    data: param,
  });

  return response;
};

/**
 * 查询资产列表
 * @param param 查询参数
 */
export const queryAssetList = async () => {
  const FinalAssets = await getCombinedAssets();

  const components = Object.keys(FinalAssets.components).map(key => {
    const asset = FinalAssets.components[key];
    const { pkg, version, info } = asset;
    return {
      type: 1, //组件
      id: key,
      pkg,
      version,
      ...info,
    };
  });
  const elements = Object.keys(FinalAssets.elements).map(key => {
    const asset = FinalAssets.elements[key];
    const { pkg, version, info } = asset;
    return {
      type: 2, //元素
      id: key,
      pkg,
      version,
      ...info,
    };
  });
  const layouts = Object.keys(FinalAssets.layouts).map(key => {
    const asset = FinalAssets.layouts[key];
    const { pkg, version, info } = asset;
    return {
      type: 6, //元素
      id: key,
      pkg,
      version,
      ...info,
    };
  });
  return { components, elements, layouts };
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
  if (IS_LOCAL_ENV) {
    return new Promise(resolve => {
      resolve({
        success: true,
      });
    });
  }
  const response = await request(`${SERVICE_URL_PREFIX}/asset/createproject`, {
    method: 'post',
    data: projectParams,
  });

  return convertResponse(response);
};

/**
 * 在 AntCode 上 fork 项目
 * @param projectParams 创建项目的参数
 */
export const forkProjectOnAntCode = async projectParams => {
  if (IS_LOCAL_ENV) {
    return new Promise(resolve => {
      resolve({
        success: true,
      });
    });
  }
  const response = await request(`${SERVICE_URL_PREFIX}/asset/forkproject`, {
    method: 'post',
    data: projectParams,
  });

  return convertResponse(response);
};

/**
 * 使用 Chair Task 进行在线构建
 * @param buildParams 构建参数
 */
export const buildAssetWithTask = async (buildParams: BuildParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/buildasset`, {
    method: 'post',
    data: buildParams,
  });

  return response;
};

/**
 * 通过资产 ID 删除资产
 * @param assetId 资产 ID
 */
export const deleteAssetById = async (assetId: number) => {
  const response = await request(`${SERVICE_URL_PREFIX}/asset/delete`, {
    method: 'post',
    data: {
      assetId,
    },
  });

  return response;
};