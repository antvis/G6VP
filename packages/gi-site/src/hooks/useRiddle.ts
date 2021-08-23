import { useEffect, useState } from 'react';
import { getRiddleAppCode } from './utils';

const RIDDLE_API_ENDPOINT = 'https://riddle.alibaba-inc.com/riddles/define';
let isInternalNetwork: boolean | undefined;

const useInternalNet = () => {
  const [isInternal, setIsInternal] = useState<boolean>(Boolean(isInternalNetwork));

  useEffect(() => {
    if (isInternalNetwork === undefined) {
      const img = document.createElement('img');

      setTimeout(() => {
        img.src = '';
        img.remove();
      }, 200);

      img.onload = () => {
        isInternalNetwork = true;
        setIsInternal(true);
        img.remove();
      };

      img.src = 'https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';
    }
  }, []);

  return isInternal;
};

export default opts => {
  const [handler, setHandler] = useState<(...args: any) => void | undefined>();
  const isInternal = useInternalNet();

  useEffect(() => {
    if (opts && isInternal) {
      const form = document.createElement('form');
      const input = document.createElement('input');

      form.method = 'POST';
      form.target = '_blank';
      form.style.display = 'none';
      form.action = RIDDLE_API_ENDPOINT;
      form.appendChild(input);
      form.setAttribute('data-demo', opts.title || '');

      input.name = 'data';

      // create riddle data
      input.value = JSON.stringify({
        title: '',
        js: getRiddleAppCode(opts),
        css: '',
        json: `
        {
          "name": "riddle",
          "dependencies": {
           "@alipay/gi-assets": "^0.2.x",
            "@alipay/graphinsight": "^0.2.x",
            "@antv/graphin": "^2.x",
            "react":"17.x",
            "react-dom":"17.x"
          }
        }
        `,
      });

      document.body.appendChild(form);

      setHandler(() => () => form.submit());

      return () => form.remove();
    }
  }, [opts, isInternal]);

  return handler;
};
