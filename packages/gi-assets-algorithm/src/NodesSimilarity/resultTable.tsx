// @ts-nocheck
import { useContext } from '@antv/gi-sdk';
import { DownloadOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { exportCSV, formatFileName } from '../utils/csv';
import $i18n from '../i18n';

interface Props {
  similarNodes;
  similarityKey: string;
  topReset: boolean;
}

const ClustersResultTable: React.FC<Props> = ({ similarNodes, similarityKey = 'similarity', topReset }) => {
  const { graph } = useContext();
  const [sortOrder, setSortOrder] = useState(false);
  useEffect(() => {
    setSortOrder(false);
  }, [topReset]);

  const formatSimilar = value => Number(`${value}`.slice(0, 7));

  let propertiesKeys: string[] = [];
  const resData = [];
  similarNodes?.forEach((node, index) => {
    if (!node.properties) {
      return;
    }
    propertiesKeys.push('id');
    propertiesKeys = propertiesKeys.concat(Object.keys(node.properties));
    resData.push({
      ...node.properties,
      index,
      label: node.label,
      similarity: node[similarityKey] ? formatSimilar(node[similarityKey]) : '-',
      id: node.id,
    });
  });
  propertiesKeys = Array.from(new Set(propertiesKeys));

  const columns = [
    {
      title: $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.SerialNumber', dm: '序号' }),
      dataIndex: 'index',
      key: 'index',
      width: 60,
      fixed: 'left',
    },
    {
      title: $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.NodeName', dm: '节点名称' }),
      dataIndex: 'label',
      key: 'label',
      textWrap: 'word-break',
      ellipsis: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.NodeId', dm: '节点 ID' }),
      dataIndex: 'id',
      key: 'id',
      textWrap: 'word-break',
      ellipsis: true,
      // fixed: 'left',
      width: 100,
    },
    {
      title: $i18n.get({
        id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.CosineSimilarity',
        dm: '余弦相似度',
      }),
      dataIndex: 'similarity',
      key: 'similarity',
      textWrap: 'word-break',
      // fixed: 'left',
      width: 120,
      sortOrder,
      sorter: (a, b) => a.similarity - b.similarity,
    },
  ];

  propertiesKeys.forEach(propertyKey => {
    columns.push({
      title: propertyKey,
      dataIndex: propertyKey,
      key: propertyKey,
      width: 120,
      textWrap: 'word-break',
      ellipsis: true,
    });
  });

  const onTableChange = (pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      setSortOrder(sorter.order || false);
    }
  };

  const download = () => {
    const fileName = formatFileName('similarity_result');
    exportCSV(
      {
        data: resData,
        title: [
          $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.SerialNumber', dm: '序号' }),
          $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.NodeName', dm: '节点名称' }),
          $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.CosineSimilarity', dm: '余弦相似度' }),
        ].concat(propertiesKeys),
        titleForKey: ['index', 'label', 'similarity'].concat(propertiesKeys),
      },
      fileName,
    );
  };

  const activeItem = record => {
    clearActiveItem();
    const item = graph.findById(record.id);
    if (!item) return;
    graph.setItemState(item, 'active', true);
  };

  const clearActiveItem = () => {
    const activateItems = graph.findAllByState('node', 'active').concat(graph.findAllByState('edge', 'active'));
    activateItems.forEach(item => {
      graph.setItemState(item, 'active', false);
    });
  };

  const maxSimilarNode = similarNodes[1];
  const minSimilarNode = similarNodes[similarNodes.length - 1];

  return (
    <>
      <Tooltip
        title={$i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.DownloadCsv', dm: '下载 CSV' })}
        placement="topRight"
      >
        <DownloadOutlined style={{ float: 'right' }} onClick={download} />
      </Tooltip>
      <div className="nodes-similarity-table-wrapper">
        <div className="nodes-similarity-statistic">
          <div>
            <span>
              {$i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.MaximumValue', dm: '最大值:' })}
            </span>
            <span className="nodes-similarity-statistic-value">
              {formatSimilar(maxSimilarNode[similarityKey])}（{maxSimilarNode?.label}）
            </span>
          </div>
          <div>
            <span>
              {$i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.MinimumValue', dm: '最小值:' })}
            </span>
            <span className="nodes-similarity-statistic-value">
              {formatSimilar(minSimilarNode[similarityKey])}（{minSimilarNode?.label}）
            </span>
          </div>
        </div>
        <Table
          dataSource={resData}
          columns={columns}
          size="small"
          showSorterTooltip={{
            title: $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.resultTable.Sort', dm: '排序' }),
          }}
          scroll={{ x: 200 }}
          onChange={onTableChange}
          onRow={record => ({
            onMouseEnter: () => activeItem(record),
            onMouseLeave: clearActiveItem,
          })}
        />
      </div>
    </>
  );
};

export default ClustersResultTable;
