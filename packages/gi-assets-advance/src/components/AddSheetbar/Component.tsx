import { extra, IGIAC, useContext } from '@alipay/graphinsight';
import * as React from 'react';

const { GIAComponent } = extra;
export interface AddSheetbarProps {
  GIAC: IGIAC;
}

const AddSheetbar: React.FunctionComponent<AddSheetbarProps> = props => {
  const { handleAddSheetbar, graph } = useContext();

  const [state, setState] = React.useState(() => {
    return {
      selected: {
        nodes: [],
        edges: [],
      },
    };
  });

  const { selected } = state;

  const { GIAC } = props;
  const handleClick = React.useCallback(() => {
    if (selected.nodes.length === 0) {
      return;
    }
    handleAddSheetbar(selected);
  }, [selected]);

  React.useEffect(() => {
    //@ts-ignore
    graph.on('nodeselectchange', e => {
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

  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={handleClick} />
    </>
  );
};

export default AddSheetbar;
