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
  if (options.url) {
    const href = options.url.replace('min.js', 'css');
    link.href = href;
  }
  link.rel = 'stylesheet';
  document.head.append(link);
};

const loadJS = options => {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.type = options.type || 'text/javascript';
    script.async = !!options.async;
    script.charset = 'UTF-8';
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
    script.onerror = () => {
      resolve(script);
    };
  });
};

const loader = options => {
  // const queries

  return Promise.all([
    //js
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
    //css
    ...options.map(opt => {
      if (window[opt.global]) {
        return undefined;
      }
      return loadCss(opt);
    }),
  ]).then(res => {
    return res.filter(c => {
      return c;
    });
  });
};

const appendInfo = (itemAssets, version, name) => {
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
export const loaderCombinedAssets = async (packages: AssetPackage[]) => {
  const assets = await loader(packages).then(res => {
    return res;
  });

  //@ts-ignore
  return assets.reduce(
    (acc, curr) => {
      const { components, version, name, elements, layouts, services } = curr;
      const coms = appendInfo(components, version, name);
      const elems = appendInfo(elements, version, name);
      const lays = appendInfo(layouts, version, name);

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
      services: [],
    },
  );
};
