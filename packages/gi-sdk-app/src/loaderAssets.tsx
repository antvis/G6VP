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

export const loadJS = async (options: AssetPackage) => {
  return new Promise(resolve => {
    // load js
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.id = options.global || options.url;
    script.src = options.url;
    script.defer = true;
    script.async = false;
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

export const loader = async (options: AssetPackage[]) => {
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
