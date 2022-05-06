import { ConfigProvider } from 'antd';
import { useContext } from 'react';

const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string;
  },
) => {
  if ('ConfigContext' in ConfigProvider) {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    return getPrefixCls(tag, props?.prefixCls);
  } else {
    const prefix = props?.prefixCls ?? 'ant-';
    return `${prefix}${tag ?? ''}`;
  }
};
export default usePrefixCls;
