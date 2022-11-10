import { useContext } from '@alipay/graphinsight';
import { Behaviors } from '@antv/graphin';
import React from 'react';
import CanvasClick from './CanvasClick';
import CanvasDoubleClick from './CanvasDoubleClick';

const { DragCanvas, ZoomCanvas, BrushSelect, Hoverable, ActivateRelations } = Behaviors;

export interface CanvasSettingProps {
  dragCanvas: {
    disabled: boolean;
    direction: string;
    enableOptimize: boolean;
  };
  styleCanvas: {
    backgroundColor: string;
    backgroundImage: string;
  };
  zoomCanvas: {
    disabled: boolean;
    enableOptimize: boolean;
  };
  clearStatus: boolean;
  doubleClick: boolean;
}

const CanvasSetting: React.FunctionComponent<CanvasSettingProps> = props => {
  const { styleCanvas, dragCanvas, zoomCanvas, clearStatus, doubleClick } = props;
  const { backgroundColor, backgroundImage } = styleCanvas;
  const { GISDK_ID } = useContext();

  React.useLayoutEffect(() => {
    const parent_container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLElement;
    const container = parent_container.firstElementChild as HTMLElement;
    if (parent_container && container) {
      container.style.backgroundColor = backgroundColor;
      container.style.backgroundImage = `url(${backgroundImage})`;
    }
  }, [backgroundColor, backgroundImage]);
  return (
    <>
      <DragCanvas
        disabled={dragCanvas.disabled}
        direction={dragCanvas.direction}
        enableOptimize={dragCanvas.enableOptimize}
      />
      <ZoomCanvas enableOptimize={zoomCanvas.enableOptimize} disabled={zoomCanvas.disabled} />
      <BrushSelect />
      {clearStatus !== false && <CanvasClick />}
      {doubleClick !== false && <CanvasDoubleClick />}
    </>
  );
};

export default CanvasSetting;
