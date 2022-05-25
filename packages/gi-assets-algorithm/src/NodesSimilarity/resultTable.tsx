// @ts-nocheck
import { DownloadOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { exportCSV, formatFileName } from '../utils/csv';
import { NodesSimilarityAlgorithm } from './Component';
import FormattedMessage, { formatMessage } from './locale';

interface Props {
  similarNodes;
  similarityKey: string;
  topReset: boolean;
}

const ClustersResultTable: React.FC<Props> = ({ similarNodes, similarityKey = 'similarity', topReset }) => {
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
      title: <FormattedMessage id={'index'} />,
      dataIndex: 'index',
      key: 'index',
      width: 60,
      fixed: 'left',
    },
    {
      title: <FormattedMessage id={'node-name'} />,
      dataIndex: 'label',
      key: 'label',
      textWrap: 'word-break',
      ellipsis: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: <FormattedMessage id={'node-id'} />,
      dataIndex: 'id',
      key: 'id',
      textWrap: 'word-break',
      ellipsis: true,
      // fixed: 'left',
      width: 100,
    },
    {
      title: (
        <FormattedMessage
          id={`itelligent-analysis.nodes-similarity.table-title.${NodesSimilarityAlgorithm.nodesConsineSimilarity}`}
        />
      ),
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
          formatMessage({ id: 'index' }),
          formatMessage({ id: 'node-name' }),
          formatMessage({
            id: `nodes-similarity.table-title.${NodesSimilarityAlgorithm.nodesConsineSimilarity}`,
          }),
        ].concat(propertiesKeys),
        titleForKey: ['index', 'label', 'similarity'].concat(propertiesKeys),
      },
      fileName,
    );
  };

  const maxSimilarNode = similarNodes[1];
  const minSimilarNode = similarNodes[similarNodes.length - 1];

  return (
    <>
      <Tooltip title={<FormattedMessage id="download-csv" />} placement="topRight">
        <DownloadOutlined style={{ float: 'right' }} onClick={download} />
      </Tooltip>
      <div className="nodes-similarity-table-wrapper">
        <div className="nodes-similarity-statistic">
          <div>
            <span>
              <FormattedMessage id="max" />:{' '}
            </span>
            <span className="nodes-similarity-statistic-value">
              {formatSimilar(maxSimilarNode[similarityKey])}（{maxSimilarNode?.label}）
            </span>
          </div>
          <div>
            <span>
              <FormattedMessage id="min" />:{' '}
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
            title: formatMessage({ id: 'sort' }),
          }}
          scroll={{ x: 200 }}
          onChange={onTableChange}
        />
      </div>
    </>
  );
};

export default ClustersResultTable;
