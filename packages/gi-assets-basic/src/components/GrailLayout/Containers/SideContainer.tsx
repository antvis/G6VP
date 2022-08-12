import React from 'react';
import { useImmer } from 'use-immer';
import { Button } from 'antd';
import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

export interface SideContainerProps {
  width: string;
  isDisplay: boolean;
  children: any;
  type: 'left' | 'right';
}

interface IState {
  visible: boolean;
}

const SideContainer: React.FC<SideContainerProps> = props => {
  const { children, width, isDisplay, type } = props;
  const [state, updateState] = useImmer<IState>({
    visible: true,
  });

  console.log("state:", state)

  const toggleVisible = () => {
    updateState(draft => {
      draft.visible = !draft.visible;
    });
  };

  let icon;


  return (
    <div
      style={{ width:  state.visible ? width : "0px", display: isDisplay ? 'flex' : 'none' }}
      className={`graphinsight-grail-layout graphinsight-grail-layout-${type}`}
    >
      <Button
        onClick={toggleVisible}
        type="text"
        icon={type === 'left' && state.visible ? <VerticalRightOutlined /> : <VerticalLeftOutlined />}
        style={{
          position: "absolute",
          left: type === "left" ? "100%" : "",
          right: type === "right" ? "100%" : "",
        }}
      />
      {children}
    </div>
  );
};

export default SideContainer;
