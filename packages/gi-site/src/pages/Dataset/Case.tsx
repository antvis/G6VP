import * as React from 'react';
import * as DatasetServices from '../../services/dataset';
import { getUid } from '../Workspace/utils';
import DatasetTable from './Table';
interface CasesProps {}

const GS_GRAPH_LISTS = [
  {
    name: 'my-release',
    type: 'GrootGraph',
    creation_time: '2023/03/02 10:17:49',
    schema: {
      vertices: [
        {
          label: 'person',
          properties: [
            {
              name: 'id',
              id: 1,
              type: 'LONG',
              is_primary_key: true,
            },
            {
              name: 'name',
              id: 2,
              type: 'STRING',
              is_primary_key: false,
            },
            {
              name: 'location',
              id: 3,
              type: 'STRING',
              is_primary_key: false,
            },
          ],
        },
        {
          label: 'software',
          properties: [
            {
              name: 'id',
              id: 1,
              type: 'LONG',
              is_primary_key: true,
            },
            {
              name: 'name',
              id: 2,
              type: 'STRING',
              is_primary_key: false,
            },
          ],
        },
      ],
      edges: [
        {
          label: 'traverses',
          properties: [
            {
              name: 'id',
              id: 1,
              type: 'LONG',
              is_primary_key: false,
            },
          ],
          relations: [
            {
              src_label: 'software',
              dst_label: 'software',
            },
          ],
        },
        {
          label: 'uses',
          properties: [
            {
              name: 'id',
              id: 1,
              type: 'LONG',
              is_primary_key: false,
            },
            {
              name: 'skill',
              id: 4,
              type: 'LONG',
              is_primary_key: false,
            },
          ],
          relations: [
            {
              src_label: 'person',
              dst_label: 'software',
            },
          ],
        },
        {
          label: 'develops',
          properties: [
            {
              name: 'id',
              id: 1,
              type: 'LONG',
              is_primary_key: false,
            },
            {
              name: 'since',
              id: 5,
              type: 'LONG',
              is_primary_key: false,
            },
          ],
          relations: [
            {
              src_label: 'person',
              dst_label: 'software',
            },
          ],
        },
      ],
    },
    gremlin_interface: {
      gremlin_endpoint: 'https://gi-api.graphscope.app/gremlin',
      grpc_endpoint: '192.168.0.174:30430',
      username: 'xxxxxxxx',
      password: 'xxxxxxxx',
    },
    directed: true,
  },
];

const trans = lists => {
  const transSchemaDataFromGS = schema => {
    const nodes = schema.vertices.map(c => {
      return {
        nodeType: c.label,
        nodeTypeKeyFromProperties: undefined,
        properties: c.properties.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.type,
          };
        }, {}),
      };
    });
    const edges = schema.edges.map(c => {
      return {
        edgeType: c.label,
        edgeTypeKeyFromProperties: undefined,
        properties: c.properties.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.type,
          };
        }, {}),
      };
    });
    return { nodes, edges };
  };

  const { hostname, protocol } = window.location;
  const HTTP_SERVICE_URL = `${protocol}//${hostname}:7001`;
  return lists.map(item => {
    const { type: GSType, gremlin_interface, schema, creation_time, directed, name } = item;
    const schemaData = transSchemaDataFromGS(schema);
    const id = `ds_${getUid()}`; //GI平台需要有个datasetId，这个ID需要提前随机生成
    return {
      id,
      name,
      schemaData,
      engineId: 'GraphScope',
      engineContext: {
        ...gremlin_interface,
        type: GSType, // 原先列表中的数据，都存在engineContext中
        directed,
        HTTP_SERVICE_URL: HTTP_SERVICE_URL, //GIHttpServer 地址，这个可以根据部署环境确定
      },
      gmtCreate: creation_time,
      onwer: '东泽', // 　如果GraphScope Console有用户权限体系的话，可以加上这个Owner
      size: 'G(100,20)', //如果列表中有图的数据规模的话，可以加上，GI平台支持展示
    };
  });
};

const MOCK_GS_DATASET = trans(GS_GRAPH_LISTS);

const Cases: React.FunctionComponent<CasesProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  React.useEffect(() => {
    (async () => {
      const res = await DatasetServices.findCase();
      console.log('res', res);
      setState({
        lists: res,
      });
    })();
  }, []);
  const { lists } = state;
  return (
    <div>
      <DatasetTable data={lists} deletable={false} />
    </div>
  );
};

export default Cases;
