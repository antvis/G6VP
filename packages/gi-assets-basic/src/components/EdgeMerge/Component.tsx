// import type { EdgeConfig } from '@antv/g6';
type EdgeConfig = any;
import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
const { GIAComponent } = extra;

const EdgeMerge: React.FunctionComponent<{ GIAC: IGIAC }> = props => {
  const { GIAC } = props;
  const [state, setState] = useImmer<{
    edgeMerged: boolean;
    edgeComputed: boolean;
    mergedEdges: EdgeConfig[];
  }>({
    edgeMerged: false,
    edgeComputed: false,
    mergedEdges: [],
  });
  const { edgeMerged, edgeComputed, mergedEdges } = state;
  const { graph, data } = useContext();

  useEffect(() => {
    if (edgeMerged) {
      mergedEdges.forEach(mergedEdge => {
        const originList = Object.keys(mergedEdge.data || ({} as any));
        originList.forEach(originId => {
          const originItem = graph.findById(originId);
          if (originItem) {
            originItem.changeVisibility(true);
          }
        });
        graph.removeItem(mergedEdge.id as string);
      });
    }
    setState(draft => {
      draft.edgeComputed = false;
      draft.edgeMerged = false;
      draft.mergedEdges = [];
    });
  }, [data]);

  const getMergedEdgeData = (key: string, list: EdgeConfig[]) => {
    const {
      source,
      target,
      type,
      dataType,
      style = {},
      data: { label },
    } = list[0] as any;
    const newStyle = {
      ...style,
      keyshape: {
        ...(style.keyshape || {}),
      },
      halo: {
        visible: true,
      },
    };
    const newData = {
      source,
      target,
      label,
      length: list.length,
      aggregated: true,
      labelAttributeList: [],
      extendedAttributes: {},
      properties: {},
    };
    list.forEach(edge => {
      const { properties, extendedAttributes, labelAttributeList } = edge.data as any;
      newData.labelAttributeList = newData.labelAttributeList.concat(labelAttributeList);
      newData.extendedAttributes = { ...newData.extendedAttributes, ...extendedAttributes };
      newData.properties[edge.id as string] = properties;
    });
    return {
      id: `${key}|${Date.now()}`,
      style: newStyle,
      data: newData,
      source,
      target,
      type,
      dataType,
    };
  };

  const getMergedEdges = (edges: EdgeConfig[]) => {
    let edgeMap = new Map();
    edges.forEach(edge => {
      const { edgeType } = edge || ({} as any);
      if (edgeType) {
        const key = `${edge.source}|${edge.target}|${edgeType}`;
        if (Array.isArray(edgeMap.get(key))) {
          edgeMap.get(key).push(edge);
        } else {
          edgeMap.set(key, [edge]);
        }
      }
    });
    const mergedList: EdgeConfig[] = [];
    let i = 0;
    for (let [key, list] of edgeMap) {
      if (list.length > 1) {
        mergedList.push(getMergedEdgeData(key, list));
      }
    }
    return mergedList;
  };

  const handleShowMergedEdges = (edges: EdgeConfig[]) => {
    const mergedShow = !edgeMerged,
      originShow = edgeMerged;
    edges.forEach(mergedEdge => {
      const edge = cloneDeep(mergedEdge);
      const originList = Object.keys((edge.data as any).properties);

      originList.forEach(originId => {
        const originItem = graph.findById(originId);
        if (originItem) {
          originItem.changeVisibility(originShow);
        }
      });
      const mergedItem = graph.findById(edge.id as string);
      if (mergedItem) {
        mergedItem.changeVisibility(mergedShow);
      } else {
        graph.addItem('edge', edge, false);
      }
    });

    setState(draft => {
      draft.edgeMerged = !edgeMerged;
    });
  };
  const onClickButton = () => {
    if (!edgeComputed) {
      const list = getMergedEdges(data.edges);

      setState(draft => {
        draft.mergedEdges = list;
        draft.edgeComputed = true;
      });
      handleShowMergedEdges(list);
    } else {
      handleShowMergedEdges(mergedEdges);
    }
  };

  return (
    // <Tooltip title="针对起点、终点、边类型相同的多条边聚合成一条" color="#3056e3">
    //   <Button type="text" style={{ height: 60 }} onClick={onClickButton}>
    //     <Icon type="icon-toolbar_edge_merge" />
    //     <br />
    //     {edgeMerged ? '边恢复' : '边合并'}
    //   </Button>
    // </Tooltip>
    <GIAComponent GIAC={GIAC} onClick={onClickButton} />
  );
};

export default EdgeMerge;
