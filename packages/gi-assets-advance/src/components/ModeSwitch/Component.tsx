import { GIComponentAssets, GIComponentConfig } from '@antv/gi-sdk';
import { Segmented } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
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

  const container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  const childrenContainer = container.firstChild;

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

    const { props: itemProps, id } = item;
    const Component = assets[id].component as any;
    return <Component {...itemProps} />;
  }, [sortedComponents, state.mode, assets]);

  React.useEffect(() => {
    const graphinContainer = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
    const hasChildren = graphinContainer.childElementCount > 0;
    if (hasChildren) {
      graphinContainer.childNodes.forEach(item => {
        if (item.nodeName === 'SECTION') {
          //@ts-ignore
          item.style.display = state.mode === 'TableMode' ? 'block' : 'none';
        }
        if (item.nodeName === 'DIV') {
          //@ts-ignore
          item.style.display = state.mode === 'CanvasMode' ? 'block' : 'none';
        }
      });
    }
  }, [state.mode, GISDK_ID]);

  return (
    <>
      {ReactDOM.createPortal(
        <nav
          style={{
            top: '0px',
            left: '0px',
            right: '0px',
            zIndex: 300,
            position: 'fixed',
          }}
        >
          <div>
            {/** @ts-ignore */}
            <Segmented value={state.mode} options={options} onChange={onChange}></Segmented>
          </div>
        </nav>,
        container,
      )}

      {Content &&
        ReactDOM.createPortal(
          <section
            style={{
              background: '#fff',
              position: 'fixed',
              width: '100%',
              top: '32px',
              bottom: '0px',
              zIndex: 300,
            }}
          >
            {Content}
          </section>,
          container,
        )}
    </>
  );
};

export default ModeSwitch;
