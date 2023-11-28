import { FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { Button, Col, List, Popover, Row, Statistic, Tag, Tooltip } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';
import { IFilterCriteria } from '../FilterPanel/type';
import downloadCsv from '../common/downloadCsv';
interface interpretationProps {
  filterLogic: 'and' | 'or';
  filterOptions: { [id: string]: IFilterCriteria };
}

const interpretation: React.FunctionComponent<interpretationProps> = props => {
  const { filterOptions, filterLogic } = props;
  const { context } = useContext();
  const { data } = context;
  const { nodes, edges } = data;
  if (!nodes) {
    return null;
  }

  const options = Object.values(filterOptions);

  const handleShowFilter = () => {};
  const handleDownload = () => {
    const nodes = data.nodes.map(c => {
      return c.data;
    });
    const edges = data.edges.map(c => {
      return c.data;
    });
    nodes.length > 0 && downloadCsv(nodes, 'nodes');
    edges.length > 0 && downloadCsv(edges, 'edges');
  };
  const content = (
    <List
      size="small"
      bordered
      dataSource={options}
      renderItem={(item, index) => {
        const type = item.elementType?.toUpperCase();
        const color = type === 'NODE' ? 'green' : 'blue';
        let value: any = item.selectValue;
        if (item.analyzerType === 'DATE') {
          value = item.range?.join(' ~ ');
        }

        if (item.analyzerType === 'HISTOGRAM') {
          const tmp = item.range?.map(e => e.join('~'));
          value = tmp?.join($i18n.get({ id: 'basic.components.OverView.Interpretation.Or', dm: '或' }));
          //value = JSON.stringify(item.range)
        }

        return (
          <List.Item style={{ maxWidth: '500px', overflow: 'hidden', overflowWrap: 'anywhere' }}>
            <Tag color={color}>{type} RULE </Tag>
            {item.prop}
            {$i18n.get({ id: 'basic.components.OverView.Interpretation.For', dm: '为' })}
            {value}
          </List.Item>
        );
      }}
    />
  );

  return (
    <div>
      <Row style={{ padding: '12px' }}>
        <Col span={8}>
          <div className="ant-statistic">
            <div className="ant-statistic-title">
              {$i18n.get({ id: 'basic.components.OverView.Interpretation.DataOperations', dm: '数据操作' })}
            </div>
            <div className="ant-statistic-content">
              <span className="ant-statistic-content-value">
                <Tooltip
                  placement="topLeft"
                  title={$i18n.get({ id: 'basic.components.OverView.Interpretation.DownloadData', dm: '下载数据' })}
                >
                  <Button type="text" icon={<FileExcelOutlined />} onClick={handleDownload}></Button>
                </Tooltip>
                <Popover
                  content={content}
                  title={$i18n.get(
                    {
                      id: 'basic.components.OverView.Interpretation.CurrentFilterLogic',
                      dm: `当前筛选逻辑：${filterLogic.toUpperCase()}，筛选条件如下：`,
                    },
                    {
                      filterLogic: filterLogic.toUpperCase(),
                    },
                  )}
                  // title={`当前筛选逻辑：${filterLogic.toUpperCase()}，筛选条件如下：`}
                  trigger="hover"
                >
                  <Button type="text" icon={<FilterOutlined />} onClick={handleShowFilter}></Button>
                </Popover>
              </span>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title={$i18n.get({ id: 'basic.components.OverView.Interpretation.CurrentNode', dm: '当前节点' })}
            value={nodes.length}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={$i18n.get({ id: 'basic.components.OverView.Interpretation.CurrentEdge', dm: '当前边' })}
            value={edges.length}
          />
        </Col>
      </Row>
    </div>
  );
};

export default interpretation;
