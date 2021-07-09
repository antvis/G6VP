import { useState, useEffect } from 'react';
import LZString from 'lz-string';
import { getRiddleAppCode } from './utils';

const CSB_API_ENDPOINT = 'https://codesandbox.io/api/v1/sandboxes/define';

function serialize(data: Record<string, any>) {
  return LZString.compressToBase64(JSON.stringify(data))
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

function getCSBData(opts) {
  const ext = '.tsx';
  const files: Record<string, { content: string }> = {};
  const appFileName = `App${ext}`;
  const entryFileName = `index${ext}`;

  files['sandbox.config.json'] = {
    content: JSON.stringify(
      {
        template: 'create-react-app-typescript',
      },
      null,
      2,
    ),
  };

  files['package.json'] = {
    content: JSON.stringify(
      {
        name: '',
        description: '',
        main: entryFileName,
        dependencies: {
          'react-dom': 'latest',
        },
        devDependencies: { typescript: '^3' },
      },
      null,
      2,
    ),
  };

  files['index.html'] = { content: '<div style="margin: 16px;" id="root"></div>' };

  files[entryFileName] = {
    content: getRiddleAppCode(opts),
  };

  return serialize({ files });
}

export default opts => {
  const [handler, setHandler] = useState<(...args: any) => void | undefined>();

  useEffect(() => {
    if (opts) {
      const form = document.createElement('form');
      const input = document.createElement('input');
      const data = getCSBData(opts);

      form.method = 'POST';
      form.target = '_blank';
      form.style.display = 'none';
      form.action = CSB_API_ENDPOINT;
      form.appendChild(input);
      form.setAttribute('data-demo', opts.title || '');

      input.name = 'parameters';
      input.value = data;

      document.body.appendChild(form);

      setHandler(() => () => form.submit());

      return () => form.remove();
    }
  }, [opts]);

  return handler;
};
