import { extra, IGIAC, useContext } from '@alipay/graphinsight';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Utils } from '@antv/graphin';
import { Button } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';

const { GIAComponent } = extra;
export interface SheetbarProps {
  GIAC: IGIAC;
}

const Sheetbar: React.FunctionComponent<SheetbarProps> = props => {
  const { GISDK_ID, config, data, source, transform, services, updateContext, graph } = useContext();

  const [state, setState] = React.useState(() => {
    const initialSheetMap = new Map();

    initialSheetMap.set('default', {
      sheetName: 'default',
      sheetId: 'default',
      config: Utils.cloneDeep(config),
      data: Utils.cloneDeep(data),
      source: Utils.cloneDeep(source),
    });
    return {
      sheetMap: initialSheetMap,
      currentId: 'default',
      currentName: '默认画布',
      selected: {
        nodes: [],
        edges: [],
      },
    };
  });

  const { sheetMap, currentId, currentName, selected } = state;

  const { GIAC } = props;
  const handleClick = React.useCallback(() => {
    if (selected.nodes.length === 0) {
      return;
    }
    handleAdd(selected);
  }, [selected]);

  React.useEffect(() => {
    //@ts-ignore
    graph.on('nodeselectchange', e => {
      console.log(e, e.item);
      if (e.select) {
        //单击的时候，edge不存在
        //@ts-ignore
        const { nodes, edges } = e.selectedItems;
        const data = {
          nodes: nodes.map(n => {
            return { ...n.getModel() };
          }),
          edges: edges
            ? edges.map(e => {
                return { ...e.getModel() };
              })
            : [],
        };
        setState(preState => {
          return {
            ...preState,
            selected: data,
          };
        });
      } else {
        setState(preState => {
          return {
            ...preState,
            selected: { nodes: [], edges: [] },
          };
        });
      }
    });
  }, []);

  const options = [...sheetMap.values()];

  console.log('options', options);
  const handleAdd = (data?: { nodes: never[]; edges: never[] }) => {
    const uid = Math.random().toString(36).substr(2);
    const sheetName = '未命名画布';
    let newData = { nodes: [], edges: [] };
    if (data) {
      newData = data;
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
    updateContext(draft => {
      draft.data = newData;
      draft.source = newData;
    });
  };
  const handleReCover = React.useCallback(
    (sheetId: string) => {
      if (currentId === sheetId) {
        return;
      }

      const save = {
        data: { nodes: [], edges: [] },
        source: { nodes: [], edges: [] },
        config: {},
      };

      setState(preState => {
        // 将当前的画布数据保存下来
        const preSheetMap = preState.sheetMap;
        preSheetMap.set(currentId, {
          sheetId: currentId,
          sheetName: currentName,
          config,
          source,
          data,
        });

        // 将ID匹配到的保存数据 恢复出来
        const matchPrev = preSheetMap.get(sheetId);
        preSheetMap.set(sheetId, matchPrev);

        save.data = matchPrev.data;
        save.source = matchPrev.source;
        save.config = matchPrev.config;
        updateContext(draft => {
          draft.data = save.data;
          draft.source = save.source;
          draft.config = save.config;
          draft.layoutCache = true;
        });
        return {
          ...preState,
          sheetMap: preSheetMap,
          currentId: sheetId,
          currentName: matchPrev.sheetName,
        };
      });
    },
    [data, source, config],
  );
  const SheetComponents = (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        bottom: '-1px',
        left: '0px',
        right: '0px',
        height: '40px',
        lineHeight: '40px',
        background: ' #fff',
        border: '1px solid #fafafa',
      }}
    >
      {options.map(option => {
        const { sheetName, sheetId } = option;
        const isActive = currentId === sheetId;
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
            <Button type="text" style={{ height: '40px', width: '40px', marginLeft: '4px' }} icon={<MoreOutlined />} />
          </div>
        );
      })}
      <div>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => handleAdd()}></Button>
      </div>
    </div>
  );
  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={handleClick} />
      {ReactDOM.createPortal(
        SheetComponents,
        document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement,
      )}
    </>
  );
};

export default Sheetbar;
