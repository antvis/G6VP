import React from 'react';
import { useImmer } from 'use-immer';
import { Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export interface BottomContainerProps {
  height: string;
  isDisplay: boolean;
  left: string;
  right: string;
  children: any;
}

const BottomContainer: React.FC<BottomContainerProps> = props => {
  const { children, height, isDisplay, left, right } = props;

  const [state, updateState] = useImmer({
    visible: true,
  });

  const toggleVisible = () => {
    updateState(draft => {
      draft.visible = !draft.visible;
    });
  };

  return (
    <div
      style={{ height: state.visible ? height : '0', display: isDisplay ? 'flex' : 'none', left: left, right: right }}
      className="graphinsight-grail-layout graphinsight-grail-layout-bottom"
    >
      <Button
        onClick={toggleVisible}
        style={{
          position: 'absolute',
          bottom: '100%',
        }}
        icon={state.visible ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        type="text"
      />
      {children}
    </div>
  );
};

export default BottomContainer;