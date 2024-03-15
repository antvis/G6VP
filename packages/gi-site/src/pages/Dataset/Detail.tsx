import { ApartmentOutlined, BarsOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { useMatch } from 'umi';
import Graphin, { GraphinData } from '@antv/graphin';
import { Breadcrumb } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import * as DatasetServices from '../../services/dataset';
import { IDataset } from '../../services/typing';
import $i18n from '../../i18n';
interface DetailProps {}

const Detail: React.FunctionComponent<DetailProps> = props => {
  const match = useMatch({ path: '/dataset/list/:id' })!;
  const { id } = match.params;
  const [state, setState] = React.useState<{ dataset: Partial<IDataset>; schemaGraph: GraphinData }>({
    dataset: {},
    schemaGraph: { nodes: [], edges: [] },
  });
  const theme = localStorage.getItem('@theme') === 'dark' ? 'dark' : 'light';

  React.useEffect(() => {
    (async () => {
      const info = (await DatasetServices.queryDatasetInfo(id!)) as IDataset;
      const schemaGraph = utils.getSchemaGraph(info.schemaData, { nodes: [], edges: [] });

      setState(preState => {
        return {
          ...preState,
          dataset: info,
          schemaGraph,
        };
      });
    })();
  }, []);

  return (
    <>
      <SegmentedTabs
        defaultActive="schema"
        extra={
          <Breadcrumb>
            <Breadcrumb.Item>{$i18n.get({ id: 'gi-site.pages.Dataset.Detail.Dataset', dm: '数据集' })}</Breadcrumb.Item>
            <Breadcrumb.Item>{id}</Breadcrumb.Item>
          </Breadcrumb>
        }
        items={[
          {
            key: 'schema',
            icon: <ApartmentOutlined />,
            label: $i18n.get({ id: 'gi-site.pages.Dataset.Detail.GraphModel', dm: '图模型' }),
            children: (
              <div style={{ width: '100%', height: '100%' }}>
                <Graphin
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--background-color)',
                  }}
                  theme={{ mode: theme as 'dark' | 'light' }}
                  data={state.schemaGraph}
                  fitView
                  layout={{ type: 'graphin-force', animation: false }}
                ></Graphin>
              </div>
            ),
          },
          {
            key: 'table',
            icon: <BarsOutlined />,
            label: $i18n.get({ id: 'gi-site.pages.Dataset.Detail.Data', dm: '数据' }),
            children: <pre>{JSON.stringify(state.dataset, null, 2)}</pre>,
          },
        ]}
      />
    </>
  );
};

export default Detail;
