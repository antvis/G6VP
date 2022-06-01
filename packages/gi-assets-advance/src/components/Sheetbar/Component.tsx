import GISDK, { useContext } from '@alipay/graphinsight';
import { DeleteOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { getStyles } from './utils';
export interface SheetbarProps {
  height: number;
  placement: 'top' | 'bottom';
}
const Sheetbar: React.FunctionComponent<SheetbarProps> = props => {
  const { height, placement } = props;
  const { GISDK_ID, config, data, source, transform, services, updateContext, graph, assets } = useContext();
  const vars = React.useRef({
    tagContext: false,
  });
  const [state, setState] = React.useState(() => {
    const initialSheetMap = new Map();
    initialSheetMap.set('default', {
      sheetId: 'default',
      sheetName: '默认画布',
      config: config,
      data: data,
      source: source,
    });
    return {
      currentId: 'default',
      currentName: '默认画布',
      sheetMap: initialSheetMap,
    };
  });

  const { sheetMap, currentId, currentName } = state;

  const options = [...sheetMap.values()];
  const styles = getStyles(height, placement);

  const handleAdd = (data?: { nodes: never[]; edges: never[] }) => {
    const uid = Math.random().toString(36).substr(2);
    const sheetName = '未命名画布';
    let newData = { nodes: [], edges: [] };
    if (data) {
      newData = JSON.parse(JSON.stringify(data));
    }

    setState(preState => {
      return {
        ...preState,
        currentId: uid,
        currentName: sheetName,
        sheetMap: preState.sheetMap.set(uid, {
          sheetId: uid,
          sheetName: sheetName,
          config,
          source: newData,
          data: newData,
        }),
      };
    });
  };
  React.useEffect(() => {
    // console.log('update effect....add sheetbar', vars.current.tagContext);
    if (!vars.current.tagContext) {
      updateContext(draft => {
        //@ts-ignore
        draft.handleAddSheetbar = val => {
          handleAdd(val);
        };
      });
      vars.current.tagContext = true;
    }
  }, []);

  const handleReCover = React.useCallback(
    (sheetId: string) => {
      if (currentId === sheetId) {
        return;
      }
      setState(preState => {
        return {
          ...preState,
          currentId: sheetId,
          currentName: sheetMap.get(sheetId).sheetName,
        };
      });
    },
    [currentId, sheetMap],
  );
  const handleDelete = (id: string) => {
    if (id === 'default') {
      return;
    }
    setState(preState => {
      preState.sheetMap.delete(id);
      return {
        ...preState,
        sheetMap: preState.sheetMap,
        currentId: 'default',
        currentName: '默认画布',
      };
    });
  };

  const GISDK_DOM = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  const GISDK_PARENT_DOM = GISDK_DOM.parentElement as HTMLDivElement;

  React.useEffect(() => {
    if (currentId === 'default') {
      GISDK_DOM.style.display = 'flex';
      Object.keys(styles.container).forEach(key => {
        GISDK_DOM.style[key] = styles.container[key];
      });
    } else {
      GISDK_DOM.style.display = 'none';
    }
  }, [currentId, GISDK_DOM]);

  const SheetComponent = (
    <>
      <div style={styles.sheetbar} className="gi-sheetbar">
        {options.map(option => {
          const { sheetName, sheetId } = option;
          const isActive = currentId === sheetId;
          const sheetItemComponentsConfig = option.config.components.filter(c => {
            return c.id !== 'Sheetbar';
          });
          const sheetItemService = services.map(c => {
            if (c.id === 'GI_SERVICE_INTIAL_GRAPH') {
              return {
                id: 'GI_SERVICE_INTIAL_GRAPH',
                service: () => {
                  return new Promise(resolve => {
                    resolve(option.data);
                  });
                },
              };
            }
            return c;
          });
          const itemConfig = {
            ...option.config,
            components: sheetItemComponentsConfig,
          };
          const menuOptions = [
            {
              key: 'delete',
              label: <div onClick={() => handleDelete(sheetId)}>删除</div>,
              icon: <DeleteOutlined />,
            },
          ];
          const menu = <Menu items={sheetId === 'default' ? [] : menuOptions} />;
          return (
            <div
              key={sheetId}
              onClick={() => {
                handleReCover(sheetId);
              }}
              style={{
                // background: `${isActive ? '#3056e3' : '#fff'}`,
                color: `${isActive ? '#3056e3' : '#000'}`,
                padding: '0px 12px',
                cursor: 'pointer',
              }}
            >
              {sheetName}

              <Dropdown overlay={menu} placement="topRight" trigger={['click']}>
                <Button
                  type="text"
                  style={{ height: `${height}px`, width: `${height}px`, marginLeft: '4px' }}
                  icon={<MoreOutlined />}
                />
              </Dropdown>

              {sheetId !== 'default' &&
                ReactDOM.createPortal(
                  <GISDK
                    id={sheetId}
                    config={itemConfig}
                    assets={assets}
                    //@ts-ignore
                    services={sheetItemService}
                    style={{
                      display: sheetId === currentId ? 'flex' : 'none',
                      ...styles.container,
                    }}
                  />,
                  GISDK_PARENT_DOM,
                )}
            </div>
          );
        })}
        <div>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleAdd()}
            style={{
              width: `${height}px`,
              height: `${height}px`,
            }}
          ></Button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(SheetComponent, GISDK_PARENT_DOM);
};

export default Sheetbar;
