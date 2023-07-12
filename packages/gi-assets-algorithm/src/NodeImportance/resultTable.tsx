import { useContext } from '@antv/gi-sdk';
import { Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ITEM_STATE, MappingWay } from './registerMeta';
import $i18n from '../i18n';

interface Props {
  data;
  currentAlgo: string;
  form;
  reAnalyse: number;
  nodeProperties: string[];
}

const ResultTable: React.FC<Props> = ({ data, currentAlgo, form, reAnalyse, nodeProperties }) => {
  const { graph } = useContext();

  const formValues = form.getFieldsValue();
  const edgeType = formValues['edge-property.edgeType'];

  const [sortOrder, setSortOrder] = useState(false);
  const [propertyKey, setPropertyKey] = useState('id');

  useEffect(() => {
    setSortOrder(false);
  }, [reAnalyse]);

  const getResultColumns = () => {
    const columns = [
      {
        title: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.resultTable.SerialNumber', dm: '序号' }),
        dataIndex: 'index',
        key: 'index',
        width: 60,
      },
      {
        title: nodeProperties?.length ? (
          <>
            {$i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.resultTable.Node', dm: '节点' })}

            <Select
              className="result-table-property-select"
              size="small"
              defaultValue="id"
              options={nodeProperties.map(key => ({ label: key, value: key }))}
              dropdownMatchSelectWidth={false}
              onChange={setPropertyKey}
            />
          </>
        ) : (
          $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.resultTable.Node', dm: '节点' })
        ),

        dataIndex: 'name',
        key: 'name',
        textWrap: 'word-break',
        ellipsis: true,
      },
      {
        title: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.resultTable.Importance', dm: '重要性' }),
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
        title: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.resultTable.AttributeName', dm: '属性名' }),
        dataIndex: 'values',
        key: 'values',
        textWrap: 'word-break',
      });
      columns[3].title = $i18n.get({
        id: 'gi-assets-algorithm.src.NodeImportance.resultTable.CalculationMethod',
        dm: '计算方式',
      });
    }
    return columns;
  };

  const getResultTableData = () => {
    const nodes = [...data.node.data];
    if (data.mappingWay === MappingWay.Negative) {
      nodes.reverse();
    }
    return nodes.map((node, index) => {
      return {
        key: node.id,
        index: index + 1,
        name: node.originProperties[propertyKey] || node.id,
        value: node.value,
        values: node.values?.join('; '),
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

  return (
    <div className="result-wrapper">
      <Table
        dataSource={getResultTableData()}
        //@ts-ignore
        columns={getResultColumns()}
        size="small"
        style={{ marginTop: '16px' }}
        showSorterTooltip={{
          title: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.resultTable.Sort', dm: '排序' }),
        }}
        onRow={record => {
          return {
            onMouseEnter: () => onEnterTableRow(record),
            onMouseLeave: clearActiveItems,
          };
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default ResultTable;
