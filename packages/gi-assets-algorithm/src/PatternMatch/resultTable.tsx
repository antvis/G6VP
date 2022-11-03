import { useContext } from '@antv/gi-sdk';
import { Table } from 'antd';
import React from 'react';
import FormattedMessage, { formatMessage } from './locale';
import { ITEM_STATE } from './registerMeta';

interface Props {
  matches: any;
}

const ResultTable: React.FC<Props> = ({ matches = [] }) => {
  const { graph } = useContext();

  const getResultColumns = () => {
    const columns = [
      {
        title: <FormattedMessage id={'index'} />,
        dataIndex: 'index',
        key: 'index',
        width: 60,
      },
      {
        title: <FormattedMessage id="node-count" />,
        dataIndex: 'nodeNum',
        key: 'nodeNum',
      },
      {
        title: <FormattedMessage id="edge-count" />,
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
        <FormattedMessage id="result-title" />
      </p>
      <Table
        dataSource={getResultTableData()}
        columns={getResultColumns()}
        size="small"
        style={{ marginTop: '16px' }}
        showSorterTooltip={{
          title: formatMessage({ id: 'sort' }),
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
