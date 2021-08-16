import { Behaviors } from '@antv/graphin';
import React from 'react';

const { DragCanvas, ZoomCanvas, BrushSelect } = Behaviors;

export interface CanvasSettingProps {
  styleCanvas: any;
}

const CanvasSetting: React.FunctionComponent<CanvasSettingProps> = props => {
  const { styleCanvas } = props;
  const { background, backgroundImage } = styleCanvas;
  React.useLayoutEffect(() => {
    const container = document.getElementsByClassName('graphin-core')[0] as HTMLElement;
    container.style.background = background;
    container.style.backgroundImage = `url(${backgroundImage})`;
  }, [background, backgroundImage]);
  return (
    <>
      <DragCanvas />
      <ZoomCanvas />
      <BrushSelect />
    </>
  );
};

export default CanvasSetting;
