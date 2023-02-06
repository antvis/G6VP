import * as React from 'react';
import { queryDatasetList } from '../../services/dataset';
import DatasetTable from './Table';
interface DatasetsProps {}

const schema = {
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
};

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

const schemaData = transSchemaDataFromGS(schema);
const { hostname, protocol } = window.location;
const HTTP_SERVER_URL = `${protocol}//${hostname}:7001`;
const MOCK_GS_DATASET = [
  {
    id: 'ds-bank-xxx',
    owner: '山果',
    size: 'G(100,20)',
    name: 'my_release',
    type: 'GrootGraph',
    created_time: 'Fri, 03 Feb 2023 18:17:56 +0800',
    schemaData,
    engineId: 'GraphScope',
    engineContext: {
      HTTP_SERVER_URL: HTTP_SERVER_URL,
      gremlin_endpoint: 'https://gi-api.graphscope.app/gremlin',
      grpc_endpoint: '192.168.0.174:30430',
      username: 'testuser',
      password: 'testpass',
    },
  },
];

const Datasets: React.FunctionComponent<DatasetsProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
  });
  React.useEffect(() => {
    (async () => {
      const res = await queryDatasetList();
      console.log('res', res);
      setState({
        //@ts-ignore
        lists: [...res, ...MOCK_GS_DATASET],
      });
    })();
  }, []);
  const { lists } = state;
  return (
    <div>
      <DatasetTable data={lists} />
    </div>
  );
};

export default Datasets;
