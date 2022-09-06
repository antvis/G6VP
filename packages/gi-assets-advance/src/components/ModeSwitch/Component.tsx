import { GIComponentAssets, GIComponentConfig, utils } from '@alipay/graphinsight';
import { Segmented } from 'antd';
import { useImmer } from 'use-immer';
import * as React from 'react';
import ReactDOM from 'react-dom';
import type { ContainerProps } from './typing';

export interface ModeSwitchProps extends ContainerProps {
  GI_CONTAINER: string[];
  components: GIComponentConfig[];
  assets: GIComponentAssets;
  GISDK_ID: string;
}

interface IState {
  mode: 'CanvasMode' | 'TableMode';
}

const ModeSwitch: React.FunctionComponent<ModeSwitchProps> = props => {
  const { components, assets, GISDK_ID } = props;
  const [state, updateState] = useImmer<IState>({
    mode: 'CanvasMode',
  });

  const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  const parentNode = container.parentNode as HTMLDivElement;
  let modeSwitchContainer = document.getElementById('gi-mode-switch-container');
  if (!modeSwitchContainer) {
    modeSwitchContainer = document.createElement('div');
    modeSwitchContainer.id = 'gi-mode-switch-container';
    parentNode.insertBefore(modeSwitchContainer, container);
  }

  const sortedComponents = React.useMemo(() => {
    return (
      components
        //@ts-ignore
        .sort((a, b) => a.props.GI_CONTAINER_INDEX - b.props.GI_CONTAINER_INDEX)
        .filter(item => item && item.props)
    );
  }, [components]);

  const options = sortedComponents.map(item => {
    return {
      value: item.id,
      label: item.name || item.id,
    };
  });

  // 画布模式默认存在
  options.unshift({
    value: 'CanvasMode',
    label: '画布模式',
  });

  const onChange = value => {
    updateState(draft => {
      draft.mode = value;
    });
  };

  const Content = React.useMemo(() => {
    const item = sortedComponents.find(item => item.id === state.mode);
    if (!item) return null;

    const { id } = item;
    const Component = assets[id].component as any;
    if (id === 'TableMode') {
      return <Component isSelectedActive={false} enableCopy />;
    } else {
      return <Component />;
    }
  }, [sortedComponents, state.mode, assets]);

  React.useEffect(() => {
    const graphinContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    graphinContainer.style.display = state.mode === 'CanvasMode' ? 'block' : 'none';
  }, [state.mode, GISDK_ID]);

  return (
    <>
      {ReactDOM.createPortal(
        <Segmented value={state.mode} options={options} onChange={onChange} block></Segmented>,
        modeSwitchContainer,
      )}
      {Content &&
        ReactDOM.createPortal(
          <div
            style={{
              // 设置绝对定位 和 zIndex，保证表格能够盖住画布及其组件资产
              position: 'absolute',
              zIndex: 200,
              backgroundColor: 'white',
              height: '100%',
              width: '100%',
            }}
          >
            {Content}
          </div>,
          container,
        )}
    </>
  );
};

export default ModeSwitch;
