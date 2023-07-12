import { useContext } from '@antv/gi-sdk';
import { Table } from 'antd';
import React from 'react';
import { ITEM_STATE } from './registerMeta';
import $i18n from '../i18n';

interface Props {
  matches: any;
}

const ResultTable: React.FC<Props> = ({ matches = [] }) => {
  const { graph } = useContext();

  const getResultColumns = () => {
    const columns = [
      {
        title: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.resultTable.SerialNumber', dm: '序号' }),
        dataIndex: 'index',
        key: 'index',
        width: 60,
      },
      {
        title: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.resultTable.NumberOfNodes', dm: '节点数量' }),
        dataIndex: 'nodeNum',
        key: 'nodeNum',
      },
      {
        title: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.resultTable.NumberOfEdges', dm: '边数量' }),
        dataIndex: 'edgeNum',
        key: 'edgeNum',
      },
    ];

    return columns;
  };

  const getResultTableData = () => {
    return matches.map((match, i) => {
      return {
        key: `${i}`,
        index: i + 1,
        nodeNum: match.nodes?.length || 0,
        edgeNum: match.edges?.length || 0,
      };
    });
  };

  const clearActiveItems = () => {
    const activateItems = graph
      .findAllByState('node', ITEM_STATE.Active)
      .concat(graph.findAllByState('edge', ITEM_STATE.Active));
    activateItems.forEach(item => {
      graph.setItemState(item, ITEM_STATE.Active, false);
    });
  };

  const onEnterTableRow = record => {
    clearActiveItems();
    matches[record.index - 1]?.nodes?.forEach(node => {
      graph.setItemState(node.id, ITEM_STATE.Active, true);
    });
    matches[record.index - 1]?.edges?.forEach(edge => {
      graph.setItemState(edge.id, ITEM_STATE.Active, true);
    });
  };

  return (
    <div className="kg-pattern-match-result-wrapper">
      <p className="kg-pattern-match-result-title">
        {$i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.resultTable.PatternMatchingResultList',
          dm: '模式匹配结果列表',
        })}
      </p>
      <Table
        dataSource={getResultTableData()}
        columns={getResultColumns()}
        size="small"
        style={{ marginTop: '16px' }}
        showSorterTooltip={{
          title: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.resultTable.Sort', dm: '排序' }),
        }}
        onRow={record => {
          return {
            onMouseEnter: () => onEnterTableRow(record),
            onMouseLeave: clearActiveItems,
          };
        }}
      />
    </div>
  );
};

export default ResultTable;
