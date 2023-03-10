import { ApartmentOutlined, BarsOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Segmented } from 'antd';
import * as React from 'react';
import * as DatasetServices from '../../services/dataset';
import { IDataset } from '../../services/typing';
interface DetailProps {}

const Detail: React.FunctionComponent<DetailProps> = props => {
  //@ts-ignore
  const { match } = props;
  const { id } = match.params;
  const [state, setState] = React.useState<{ dataset: Partial<IDataset> }>({
    dataset: {},
  });
  React.useEffect(() => {
    (async () => {
      const info = await DatasetServices.queryDatasetInfo(id);
      setState(preState => {
        return {
          ...preState,
          dataset: info,
        };
      });
    })();
  }, []);

  return (
    <Card
      style={{ borderRadius: '8px' }}
      // bodyStyle={{ padding: '24px 12px' }}
      title={
        <Breadcrumb>
          <Breadcrumb.Item>数据集</Breadcrumb.Item>
          {/* <Breadcrumb.Item>
            <a href={`${location.origin}/#/dataset/list`}>我的数据</a>
          </Breadcrumb.Item> */}
          <Breadcrumb.Item>{id}</Breadcrumb.Item>
        </Breadcrumb>
      }
      extra={
        <Segmented
          options={[
            {
              value: 'List',
              icon: <BarsOutlined />,
              label: '数据',
            },
            {
              value: 'Kanban',
              icon: <ApartmentOutlined />,
              label: '模型',
            },
          ]}
        />
      }
      bodyStyle={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 160px)', overflow: 'auto' }}
    >
      {/* <div style={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 150px)', overflow: 'auto' }}> */}
      <pre>{JSON.stringify(state.dataset, null, 2)}</pre>
      {/* </div> */}
    </Card>
  );
};

export default Detail;
