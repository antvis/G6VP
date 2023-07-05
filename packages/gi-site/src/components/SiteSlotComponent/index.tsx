import React from 'react';
import { Spin } from 'antd';
import getSlotEntity from './getSlotEntity';

interface Props {
  name: 'SLOT_LAYOUT_LOGO' | 'SLOT_HOME_CONTENT' | string;
}

const SlotComponent: React.FC<Props> = props => {
  const { children, name } = props;
  const [Component, setComponent] = React.useState();

  React.useEffect(() => {
    getSlotEntity(name).then(res => {
      setComponent(res?.component || children);
    });
  }, [name]);

  if (!Component) return <Spin />;
  // todo 传入 slot 通用 props
  return <>{React.cloneElement(Component, {})}</>;
};

export default SlotComponent;
