import { GraphinContext } from '@antv/graphin';
import { Col, Row, Table, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ITEM_STATE, locale, MappingWay } from './registerMeta';
import { fittingString } from './util';

interface Props {
  data;
  currentAlgo: string;
  form;
  reAnalyse: number;
}

const ResultTable: React.FC<Props> = ({ data, currentAlgo, form, reAnalyse }) => {
  const { graph } = useContext(GraphinContext);

  const formValues = form.getFieldsValue();

  const nodeProperty = formValues['node-property.property'];
  const edgeType = formValues['edge-property.edgeType'];
  const edgeProperty = formValues['edge-property.property'];

  const [sortOrder, setSortOrder] = useState(false);

  useEffect(() => {
    setSortOrder(false);
  }, [reAnalyse]);

  const getStatistic = (type, itemType = 'node') => {
    const value =
      type === 'ave' ? `${data[itemType][type].value}` : `${data[itemType][type].value} (${data[itemType][type].name})`;
    const fittedValue = fittingString(value, 250, 14);
    return (
      <>
        {locale[type]}:&nbsp;&nbsp;
        <span className="result-statistic-value">
          <Tooltip title={fittedValue.includes('…') ? value : ''}>{fittedValue}</Tooltip>
        </span>
      </>
    );
  };
  const getResultColumns = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
      },
      {
        title: '节点',
        dataIndex: 'name',
        key: 'name',
        textWrap: 'word-break',
        ellipsis: true,
      },
      {
        title: '重要性',
        dataIndex: 'value',
        key: 'value',
        textWrap: 'word-break',
        sortOrder,
        sorter: (a, b) => a.value - b.value,
      },
    ];
    if (currentAlgo === 'edge-property' && data.calcWay === 'count') {
      //@ts-ignore
      columns.splice(2, 0, {
        title: '属性名',
        dataIndex: 'values',
        key: 'values',
        textWrap: 'word-break',
      });
      columns[3].title = '计算方式';
    }
    return columns;
  };

  const getResultTableData = () => {
    const nodes = [...data.node.data];
    if (data.mappingWay === MappingWay.Negative) {
      nodes.reverse();
    }
    return nodes.map((node, index) => ({
      key: node.id,
      index: index + 1,
      name: node.name,
      value: node.value,
      values: node.values?.join('; '),
    }));
  };

  const getResultTitle = () => {
    if (data.type === 'node-property') {
      return <>{nodeProperty}&nbsp;-&nbsp;排序</>;
    }
    if (data.type === 'edge-property') {
      return (
        <>
          {edgeProperty}
          &nbsp;-&nbsp;{locale[data.calcWay]}
        </>
      );
    }
    return locale[data.type];
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
    const item = graph.findById(record.key);
    if (!item) {
      return;
    }
    graph.setItemState(item, ITEM_STATE.Active, true);

    // 若为关系属性重要性, 同时高亮该节点相关的被映射过的边
    if (currentAlgo === 'edge-property') {
      data.edge?.data?.forEach(edge => {
        const edgeItem = graph.findById(edge.id);
        if (!edgeItem) {
          return;
        }
        const edgeModel = edgeItem.getModel();
        //@ts-ignore
        if (edgeModel.data.label !== edgeType?.split('_')[1]) {
          return;
        }
        if (edgeModel.source === record.key || edgeModel.target === record.id) {
          graph.setItemState(edgeItem, ITEM_STATE.Active, true);
        }
      });
    }
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      setSortOrder(sorter.order || false);
    }
  };

  const failedMessage = data.node ? undefined : <p className="result-message">{data.message}</p>;

  return (
    <div className="result-wrapper">
      <div className="result-title">{getResultTitle()}</div>
      {failedMessage}
      {!failedMessage && (
        <div className="result-statistic">
          <Row>
            <Col span={11}>{getStatistic('ave')}</Col>
            <Col span={11}>{getStatistic('median')}</Col>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Col span={11}>{getStatistic('max')}</Col>
            <Col span={11}>{getStatistic('min')}</Col>
          </Row>
        </div>
      )}
      {!failedMessage && (
        <Table
          dataSource={getResultTableData()}
          //@ts-ignore
          columns={getResultColumns()}
          size="small"
          style={{ marginTop: '16px' }}
          showSorterTooltip={{
            title: '排序',
          }}
          onRow={record => {
            return {
              onMouseEnter: () => onEnterTableRow(record),
              onMouseLeave: clearActiveItems,
            };
          }}
          onChange={onTableChange}
        />
      )}
    </div>
  );
};

export default ResultTable;
