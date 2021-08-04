import { Toolbar } from '@antv/graphin-components';
import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import { ZoomOutOutlined, ZoomInOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
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
}

const ToolbarA: React.FunctionComponent<ToolbarProps> = props => {
  const { apis, graph } = React.useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut } = apis;
  const [stack, setStack] = React.useState({
    undo: false,
    redo: false,
  });

  const {
    direction = 'horizontal',
    options = [
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
      {
        key: 'undo',
        name: <UndoOutlined />,
        onClick: d => {
          undo();
        },
      },
      {
        key: 'redo',
        name: <RedoOutlined />,
        onClick: d => {
          redo();
        },
      },
    ],
  } = props;

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

  return (
    <>
      <Toolbar direction={direction}>
        {options?.map(d => (
          <Toolbar.Item onClick={d.onClick} key={d.key}>
            {d.name}
          </Toolbar.Item>
        ))}
      </Toolbar>
    </>
  );
};

export default ToolbarA;
