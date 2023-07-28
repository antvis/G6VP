import { Card, Col, Row } from 'antd';
import * as React from 'react';
import { getUser } from '../../services/user';
interface SolutionProps {}

const Solution: React.FunctionComponent<SolutionProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
    isLoading: true,
  });
  const { lists, isLoading } = state;

  const queryVipSolution = async () => {
    const isVIP = await getUser();

    const url = isVIP
      ? 'https://unpkg.alipay.com/@alipay/gi-assets-vip@latest/solution/index.json'
      : 'https://unpkg.com/@antv/gi-public-data@latest/solution/index.json';

    const res = await fetch(url).then(res => res.json());

    setState(preState => {
      return {
        ...preState,
        lists: res || [],
        isLoading: false,
      };
    });
  };
  React.useLayoutEffect(() => {
    queryVipSolution();
  }, []);

  if (isLoading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Row gutter={[16, 16]}>
        {lists.map((item, index) => {
          const { cover, name, desc, app } = item;

          const Cover = (
            <div
              style={{
                width: '100%',
                height: 250,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                overflow: 'hidden',
              }}
            >
              <img
                src={
                  cover ||
                  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2XRlQpcdZYIAAAAAAAAAAAAADmJ7AQ/original'
                }
                style={{ cursor: 'pointer', height: '100%' }}
                onClick={() => {
                  window.open(`${window.location.origin}/#/app/${app}`);
                }}
              />
            </div>
          );

          return (
            <Col key={index} xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Card hoverable cover={Cover} title={name}>
                {desc}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Solution;
