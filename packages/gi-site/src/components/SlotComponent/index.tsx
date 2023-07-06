import React from 'react';
import { Spin } from 'antd';
import getSlotEntity from './getSlotEntity';
import { useHistory } from 'react-router-dom';

interface Props {
  name: 'SLOT_LAYOUT_LOGO' | 'SLOT_HOME_CONTENT' | string;
}

// @ts-ignore
const SlotComponent: React.FC<Props> = props => {
  const { children, name } = props;
  const [slot, setslot] = React.useState<React.ReactNode>();
  const history = useHistory();

  React.useEffect(() => {
    getSlotEntity(name).then(res => {
      const slotComp = res && res.component;
      // @ts-ignore
      // todo 通过 props 传递给插槽渲染组件
      const slot = slotComp ? React.createElement(slotComp, { history }) : children;
      setslot(slot);
    });
  }, [name]);

  if (!slot) return <Spin />;

  return slot;
};

export default SlotComponent;
