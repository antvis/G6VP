import { GraphinContext, Behaviors } from '@antv/graphin';
import { Button, Divider, Modal, Tooltip } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { createFromIconfontCN } from '@ant-design/icons';

const { BrushSelect, DragCanvas } = Behaviors;

export interface LassoType {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const LassoSelect: React.FunctionComponent<LassoType> = props => {
  const { color, hasDivider } = props;
  const [isLasso, setIsLasso] = React.useState(false);
  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2946006_flm94532sdw.js',
  });
  const Content = props => {
    const { isLasso } = props;
    if (isLasso) {
      // 套索模式
      return (
        <>
          <Behaviors.LassoSelect trigger="drag"></Behaviors.LassoSelect>
          <BrushSelect disabled={true}></BrushSelect>
          <DragCanvas disabled={true}></DragCanvas>
        </>
      );
    } else {
      // 恢复原Behaviors
      return (
        <>
          <Behaviors.LassoSelect disabled={true}></Behaviors.LassoSelect>
          <BrushSelect></BrushSelect>
          <DragCanvas></DragCanvas>
        </>
      );
    }
  };
  const handleLasso = () => {
    setIsLasso(!isLasso);
    const container = document.getElementsByClassName('graphin-core')[0] as HTMLElement;
    container.style.opacity = isLasso ? 1 : 0.8;
  };

  return (
    <div>
      <Tooltip title="自由圈选" color={color} key={color}>
        <Button type="text" icon={<IconFont type="icon-lasso" />} onClick={handleLasso}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
      {ReactDOM.createPortal(
        <Content isLasso={isLasso}></Content>,
        //@ts-ignore
        document.getElementById('graphin-container'),
      )}
    </div>
  );
};

export default LassoSelect;
