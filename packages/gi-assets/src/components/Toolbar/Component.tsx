import { Toolbar } from '@antv/graphin-components';
import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import {
  ZoomOutOutlined,
  ZoomInOutlined,
  UndoOutlined,
  RedoOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import './index.less';

type direction = 'vertical' | 'horizontal';

export type options = {
  name: string | JSX.Element;
  key: string;
  onClick: (e) => void;
};

export interface ToolbarProps {
  direction?: direction;
  options?: options[];
  zoom?: {
    enable: true;
  };
  steps?: {
    enable: true;
  };
  view?: {
    enable: true;
  };
  download?: {
    enable: true;
  };
}

const ToolbarA: React.FunctionComponent<ToolbarProps> = props => {
  const { apis, graph } = React.useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut, downloadImage } = apis;
  const [btnDisable, setBtnDisable] = React.useState({
    undo: true,
    todu: true,
  });

  const zoomConfig = [
    {
      key: 'zoomOut',
      name: <ZoomInOutlined />,
      onClick: d => {
        handleZoomOut();
      },
    },
    {
      key: 'zoomIn',
      name: <ZoomOutOutlined />,
      onClick: d => {
        handleZoomIn();
      },
    },
  ];
  const doConfig = [
    {
      key: 'undo',
      name: <UndoOutlined />,
      onClick: d => {
        if (btnDisable.undo) {
          return;
        }
        undo();
      },
    },
    {
      key: 'todu',
      name: <RedoOutlined />,
      onClick: d => {
        if (btnDisable.todu) {
          return;
        }
        redo();
      },
    },
  ];
  const viewConfig = [
    {
      key: 'fitview',
      name: <FullscreenOutlined />,

      onClick: () => {
        graph.fitView();
      },
    },
    {
      key: 'fullscreen',
      name: <FullscreenExitOutlined />,
      onClick: () => {
        graph.fitCenter();
      },
    },
  ];
  const downloadConfig = [
    {
      key: 'download',
      name: <DownloadOutlined />,
      onClick: () => {
        graph.downloadImage();
      },
    },
  ];
  const { zoom, steps, view, download } = props;
  let defaultConfig: options[] = [];
  if (zoom?.enable) {
    defaultConfig = [...defaultConfig, ...zoomConfig];
  }
  if (steps?.enable) {
    defaultConfig = [...defaultConfig, ...doConfig];
  }
  if (view?.enable) {
    defaultConfig = [...defaultConfig, ...viewConfig];
  }
  if (download?.enable) {
    defaultConfig = [...defaultConfig, ...downloadConfig];
  }
  const { direction = 'horizontal', options = defaultConfig } = props;

  const redo = () => {
    const redoStack = graph.getRedoStack();

    if (!redoStack || redoStack.length === 0) {
      return;
    }

    const currentData = redoStack.pop();
    if (currentData) {
      const { action } = currentData;
      let data = currentData.data.after;
      graph.pushStack(action, { ...currentData.data });
      if (action === 'delete') {
        data = currentData.data.before;
      }
      update(action, data);
    }
  };
  const undo = () => {
    const undoStack = graph.getUndoStack();

    if (!undoStack || undoStack.length === 1) {
      return;
    }

    const currentData = undoStack.pop();
    if (currentData) {
      const { action } = currentData;

      graph.pushStack(action, { ...currentData.data }, 'redo');
      let data = currentData.data.before;

      if (action === 'add') {
        data = currentData.data.after;
      }
      update(action, data);
    }
  };
  const update = (action, data) => {
    if (!data) return;

    switch (action) {
      case 'visible': {
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach(model => {
            const item = graph.findById(model.id);
            if (model.visible) {
              graph.showItem(item, false);
            } else {
              graph.hideItem(item, false);
            }
          });
        });
        break;
      }
      case 'render':
      case 'update':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach(model => {
            graph.updateItem(model.id, model, false);
          });
        });
        break;
      case 'changedata':
        graph.changeData(data, false);
        break;
      case 'delete': {
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach(model => {
            const itemType = model.itemType;
            delete model.itemType;
            graph.addItem(itemType, model, false);
          });
        });
        break;
      }
      case 'add':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach(model => {
            graph.removeItem(model.id, false);
          });
        });
        break;
      case 'updateComboTree':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach(model => {
            graph.updateComboTree(model.id, model.parentId, false);
          });
        });
        break;
      default:
    }
  };

  React.useEffect(() => {
    graph.on('stackchange', evt => {
      const { undoStack, redoStack } = evt;
      const undoStackLen = undoStack.length;
      const redoStackLen = redoStack.length;

      setBtnDisable({
        undo: undoStackLen > 2 ? false : true,
        todu: redoStackLen > 0 ? false : true,
      });
    });
  }, []);

  return (
    <>
      <Toolbar direction={direction}>
        {options?.map(d => (
          <Toolbar.Item onClick={d.onClick} key={d.key}>
            <span className={`${'toolbar-item'} ${btnDisable[d.key] && 'disabled'}`}>{d.name}</span>
          </Toolbar.Item>
        ))}
      </Toolbar>
    </>
  );
};

export default ToolbarA;
