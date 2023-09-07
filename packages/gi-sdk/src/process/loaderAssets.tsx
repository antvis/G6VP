import { merge, memoize } from 'lodash-es';
export interface AssetPackage {
  name: string;
  url: string;
  global: string;
  version: string;
}

export const loadCss = options => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.href = options.id || options.url;
  const href = options.url.replace('min.js', 'css');
  link.href = href;
  link.rel = 'stylesheet';
  document.head.append(link);
};

export const loadJS = memoize(async (options: AssetPackage) => {
  return new Promise(resolve => {
    // load js
    const scriptId = options.global || options.url;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.id = scriptId;
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
}, JSON.stringify);

export const loader = async (options: AssetPackage[]) => {
  return Promise.all([
    ...options.map(opt => {
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
    let item = itemAssets[c];
    return {
      ...a,
      [c]: {
        ...item,
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
      const { components, version, name, elements, layouts, services, templates, deploys, locales, icons, slots } =
        curr;
      const coms = appendInfo(components, version, name);
      const elems = appendInfo(elements, version, name);
      const lays = appendInfo(layouts, version, name);
      const temps = appendInfo(templates, version, name);
      const dpy = appendInfo(deploys, version, name);
      const slos = appendInfo(slots, version, name);

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
        deploys: {
          ...acc.deploys,
          ...dpy,
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
        locales: {
          ...merge(acc.locales, locales),
        },
        icons: icons
          ? [
              ...acc.icons,
              {
                version,
                pkg: name,
                icons: Array.isArray(icons) ? icons : [icons],
              },
            ]
          : acc.icons,
        slots: {
          ...acc.slots,
          ...slos,
        },
      };
    },
    {
      components: {},
      elements: {},
      layouts: {},
      templates: {},
      services: [],
      deploys: {},
      locales: {},
      icons: [],
      slots: {},
    },
  );
};

export const getAssetPackages = () => {
  const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  return Object.values(packages) as AssetPackage[];
};
