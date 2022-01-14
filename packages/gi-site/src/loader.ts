export interface Package {
  name: string;
  url: string;
  global: string;
}

export const setDefaultAssetPackages = () => {
  const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');

  packages['GI_ASSETS_PACKAGES'] = {
    name: '@alipay/gi-assets-basic',
    version: '0.12.0',
    url: 'https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/0.12.0/dist/index.min.js',
    global: 'GI_Assets_Basic',
  };

  packages['GeaMakerGraphStudio'] = {
    name: '@alipay/geamaker-studio',
    version: '1.0.10',
    url: 'https://gw.alipayobjects.com/os/lib/alipay/geamaker-graphstudio/1.0.10/dist/index.min.js',
    global: 'GeaMakerGraphStudio',
  };

  localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(packages));
};

export const getAssetPackages = () => {
  const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  return Object.values(packages) as Package[];
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
  return Promise.all(
    options.map(opt => {
      return Loader(opt);
    }),
  );
};

export const getAssets = () => {
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
      return {
        ...item,
        assets,
      };
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
  return assets.reduce(
    (acc, curr) => {
      return {
        components: {
          ...acc.components,
          ...curr.assets.components,
        },
        elements: {
          ...acc.elements,
          ...curr.assets.elements,
        },
        layouts: {
          ...acc.layouts,
          ...curr.assets.layouts,
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
  const packages = getAssetPackages();
  const options = packages.map(item => {
    return {
      url: item.url,
    };
  });

  return loadJS(options).then(res => {
    return getAssets();
  });
};
