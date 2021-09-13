import { extractDefault } from '@ali/react-datav-gui-utils';

const registerMeta = context => {
  const { data, keys } = context;
  return {};
};

const configObj = registerMeta({ data: {}, keys: ['id'] });
export const defaultProps = extractDefault({ config: configObj, value: {} });
export default registerMeta;
