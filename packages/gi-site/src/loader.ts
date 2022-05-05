//import * as GI_ASSETS_ADVANCE from '@alipay/gi-assets-advance';
import * as GI_ASSETS_BASIC from '@alipay/gi-assets-basic';
//import * as GI_ASSETS_SCENE from '@alipay/gi-assets-scene';
import { isDev, OFFICIAL_PACKAGES } from '../.umirc';

const LOCAL_ASSETS = [
  GI_ASSETS_BASIC,
  //GI_ASSETS_ADVANCE,
  //GI_ASSETS_SCENE,
];
console.log('OFFICIAL_PACKAGES', OFFICIAL_PACKAGES);

/** 是否为本地研发模式 */
// export const isDev = process.env.NODE_ENV === 'development';
console.log('isDev loader', isDev);
export interface Package {
  name: string;
  url: string;
  global: string;
}

export const setDefaultAssetPackages = () => {
  const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  /** 保持内置的组件都是最新版本 */
  OFFICIAL_PACKAGES.forEach(pkg => {
    packages[pkg.global] = {
      ...pkg,
    };
  });

  // packages['GeaMakerGraphStudio'] = {
  //   name: '@alipay/geamaker-studio',
  //   version: '1.0.23',
  //   url: 'https://gw.alipayobjects.com/os/lib/alipay/geamaker-graphstudio/1.0.23/dist/index.min.js',
  //   global: 'GeaMakerGraphStudio',
  // };

  // packages['GI_Assets_Kg'] = {
  //   name: '@alipay/gi-assets-kg',
  //   version: '0.0.7',
  //   url: 'https://gw.alipayobjects.com/os/lib/alipay/gi-assets-kg/0.0.7/dist/index.min.js',
  //   global: 'GI_Assets_Kg',
  // };

  localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(packages));
};

export const getAssetPackages = () => {
  const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  return Object.values(packages) as Package[];
};
const LoaderCss = options => {
  // return new Promise(resolve => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.href = options.id || options.url;
  if (options.url) {
    const href = options.url.replace('min.js', 'css');
    link.href = href;
  }
  link.rel = 'stylesheet';

  document.head.append(link);
  // link.onload = () => {
  //   resolve(link);
  // };
  // });
};
const Loader = options => {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.type = options.type || 'text/javascript';
    script.async = !!options.async;
    script.id = options.id || options.url;
    if (options.url) {
      script.src = options.url;
    }
    if (options.text) {
      script.text = options.text;
    }
    document.body.append(script);
    script.onload = () => {
      resolve(script);
    };
  });
};

export const loadJS = options => {
  return Promise.all([
    //js
    ...options.map(opt => {
      if (window[opt.global]) {
        return window[opt.global];
      }
      return Loader(opt);
    }),
    //css
    ...options.map(opt => {
      if (window[opt.global]) {
        return;
      }
      return LoaderCss(opt);
    }),
  ]);
};

export const getAssets = () => {
  if (isDev) {
    return LOCAL_ASSETS.map(c => {
      return c;
    });
  }
  const packages = getAssetPackages();

  return packages
    .map(item => {
      let assets = window[item.global];
      if (!assets) {
        console.warn(`${item.global} is not found`);
        return null;
      }
      if (assets.hasOwnProperty('default')) {
        //临时处理，后面要形成资产打包规范
        assets = assets.default;
      }
      return assets;
    })
    .filter(c => {
      return c;
    });
};

type AssetsKey = 'components' | 'elements' | 'layouts';
type AssetsValue = {
  [id: string]: {
    registerMeta: () => void;
    info: {
      id: string;
    };
    component: React.FunctionComponent | any;
  };
};

export type IAssets = Record<AssetsKey, AssetsValue>;

/**
 * 获取融合后的资产
 * @returns
 */
export const getCombinedAssets = () => {
  const assets = getAssets();
  //@ts-ignore
  return assets.reduce(
    (acc, curr) => {
      return {
        components: {
          ...acc.components,
          ...curr.components,
        },
        elements: {
          ...acc.elements,
          ...curr.elements,
        },
        layouts: {
          ...acc.layouts,
          ...curr.layouts,
        },
      };
    },
    {
      components: {},
      elements: {},
      layouts: {},
    },
  );
};
/**
 * 动态加载组件，支持同时加载多个
 * @param targets { LoadModules[] } 要加载的组件列表
 */
export const dynamicLoadModules = async () => {
  if (isDev) {
    return getAssets();
  }
  const packages = getAssetPackages();

  return loadJS(packages).then(res => {
    return getAssets();
  });
};
