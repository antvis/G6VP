import { extractDefault } from '@ali/react-datav-gui-utils';
import { Behaviors } from '@antv/graphin';
import merge from 'deepmerge';
import React from 'react';
import registerMeta from './registerMeta';

const { DragCanvas, ZoomCanvas, BrushSelect } = Behaviors;

export interface CanvasSettingProps {
  dragCanvas: {
    enable: boolean;
    direction: string;
    enableOptimize: boolean;
  };
  styleCanvas: {
    background: string;
    backgroundImage: string;
  };
}

export const defaultProps = extractDefault({ config: registerMeta({ data: {} }) }) as CanvasSettingProps;

const CanvasSetting: React.FunctionComponent<CanvasSettingProps> = props => {
  const { styleCanvas } = merge(defaultProps, props);
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
