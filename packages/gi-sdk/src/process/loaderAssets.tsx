export interface AssetPackage {
  name: string;
  url: string;
  global: string;
  version: string;
}

const loadCss = options => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.href = options.id || options.url;
  const href = options.url.replace('min.js', 'css');
  link.href = href;
  link.rel = 'stylesheet';
  document.head.append(link);
};

const loadJS = async (options: AssetPackage) => {
  return new Promise(resolve => {
    // load js
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.id = options.global || options.url;
    script.src = options.url;
    document.body.append(script);
    // load css
    const link = document.createElement('link');
    const href = options.url.replace('min.js', 'css');
    link.href = href;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.append(link);

    script.onload = () => {
      resolve(script);
    };
    script.onerror = () => {
      resolve(script);
    };
  });
};

const loader = async (options: AssetPackage[]) => {
  return Promise.all([
    ...options.map(opt => {
      const asset = window[opt.global];
      if (asset) {
        return { ...asset, ...opt };
      }
      return loadJS(opt).then(_res => {
        let assets = window[opt.global];
        if (!assets) {
          console.warn(`${opt.global} is not found`);
          return undefined;
        }
        if (assets.hasOwnProperty('default')) {
          //临时处理，后面要形成资产打包规范
          //@ts-ignore
          assets = assets.default;
        }
        return { ...assets, ...opt };
      });
    }),
  ]).then(res => {
    return res.filter(c => {
      return c;
    });
  });
};

const appendInfo = (itemAssets, version: string, name: string) => {
  if (!itemAssets) {
    return {};
  }
  const coms = Object.keys(itemAssets).reduce((a, c) => {
    return {
      ...a,
      [c]: {
        ...itemAssets[c],
        version,
        pkg: name,
      },
    };
  }, {});
  return coms;
};

export const loaderAssets = async (packages: AssetPackage[]) => {
  return loader(packages).then(res => {
    return res;
  });
};

/**
 * 获取融合后的资产
 * @returns
 */

export const loaderCombinedAssets = async (packages: AssetPackage[], ASSETS?: any) => {
  let assets;
  if (ASSETS) {
    const defaultIds = ASSETS.map(item => item.global);
    const others = packages.filter(pkg => {
      return defaultIds.indexOf(pkg.global) == -1;
    });
    const othersAssets = await loader(others).then(res => {
      return res;
    });
    assets = [...ASSETS, ...othersAssets];
  } else {
    assets = await loader(packages).then(res => {
      return res;
    });
  }
  return assets.reduce(
    (acc, curr) => {
      const { components, version, name, elements, layouts, services, templates } = curr;

      const coms = appendInfo(components, version, name);
      const elems = appendInfo(elements, version, name);
      const lays = appendInfo(layouts, version, name);
      const temps = appendInfo(templates, version, name);

      return {
        components: {
          ...acc.components,
          ...coms,
        },
        elements: {
          ...acc.elements,
          ...elems,
        },
        layouts: {
          ...acc.layouts,
          ...lays,
        },
        templates: {
          ...acc.templates,
          ...temps,
        },
        services: services
          ? [
              ...acc.services,
              {
                version,
                pkg: name,
                ...services,
              },
            ]
          : acc.services,
      };
    },
    {
      components: {},
      elements: {},
      layouts: {},
      templates: {},
      services: [],
    },
  );
};

export const getAssetPackages = () => {
  const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  return Object.values(packages) as AssetPackage[];
};
