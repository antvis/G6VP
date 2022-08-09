import { GIAssets, GIComponentConfig, utils } from '@alipay/graphinsight';
import { Segmented } from 'antd';
import { useImmer } from 'use-immer';
import * as React from 'react';
import ReactDOM from 'react-dom';
import TableMode from '../TableMode/Component';
import type { ContainerProps } from './typing';

export interface ModeSwitchProps extends ContainerProps {
  GI_CONTAINER: string[];
  components: GIComponentConfig[];
  assets: GIAssets;
  GISDK_ID: string;
}

interface IState {
  mode: 'CanvasMode' | 'TableMode';
}

const ModeSwitch: React.FunctionComponent<ModeSwitchProps> = props => {
  const { components, assets, placement, offset, GISDK_ID, GI_CONTAINER } = props;
  const [state, updateState] = useImmer<IState>({
    mode: 'CanvasMode',
  });

  const positionStyle = utils.getPositionStyles(placement, offset);

  const container = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;

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
    console.log(value)
    updateState(draft => {
      draft.mode = value;
    });
  };

  React.useEffect(() => {
    const graphinContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    graphinContainer.style.display = state.mode === 'CanvasMode' ? 'block' : 'none'
  }, [state.mode, GISDK_ID]);

  return (
    <>
      {ReactDOM.createPortal(
        <div style={{ ...positionStyle, zIndex: 100 }}>
          <Segmented value={state.mode} options={options} onChange={onChange} block></Segmented>
        </div>,
        container,
      )}
      {state.mode === 'TableMode' && ReactDOM.createPortal(<TableMode isSelectedActive={false} enableCopy />, container)}
    </>
  );
};

export default ModeSwitch;
