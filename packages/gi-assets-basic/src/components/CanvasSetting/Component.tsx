import { extractDefault } from '@ali/react-datav-gui-utils';
import { Behaviors } from '@antv/graphin';
import merge from 'deepmerge';
import React from 'react';
import registerMeta from './registerMeta';

const { DragCanvas, ZoomCanvas, BrushSelect, Hoverable, ActivateRelations } = Behaviors;

export interface CanvasSettingProps {
  dragCanvas: {
    disabled: boolean;
    direction: string;
    enableOptimize: boolean;
  };
  styleCanvas: {
    background: string;
    backgroundImage: string;
  };
  zoomCanvas: {
    disabled: boolean;
    enableOptimize: boolean;
  };
  elementInteraction: {
    enableNodeHover: boolean;
    enableEdgeHover: boolean;
  };
  highlight: {
    trigger: string;
    enable: boolean;
  };
}

export const defaultProps = extractDefault({ config: registerMeta({ data: {} }) }) as CanvasSettingProps;

const CanvasSetting: React.FunctionComponent<CanvasSettingProps> = props => {
  const { styleCanvas, dragCanvas, zoomCanvas, elementInteraction, highlight } = merge(defaultProps, props);
  const { background, backgroundImage } = styleCanvas;
  const { enableEdgeHover, enableNodeHover } = elementInteraction;
  console.log('render....', props);
  React.useLayoutEffect(() => {
    const container = document.getElementsByClassName('graphin-core')[0] as HTMLElement;
    container.style.background = background;
    container.style.backgroundImage = `url(${backgroundImage})`;
  }, [background, backgroundImage]);
  return (
    <>
      <DragCanvas
        disabled={dragCanvas.disabled}
        direction={dragCanvas.direction}
        enableOptimize={dragCanvas.enableOptimize}
      />
      <ZoomCanvas enableOptimize={zoomCanvas.enableOptimize} disabled={zoomCanvas.disabled} />
      <BrushSelect />
      {highlight.enable && <ActivateRelations trigger={highlight.trigger} />}

      {enableNodeHover && <Hoverable bindType="node" />}
      {enableEdgeHover && <Hoverable bindType="edge" />}
    </>
  );
};

export default CanvasSetting;
