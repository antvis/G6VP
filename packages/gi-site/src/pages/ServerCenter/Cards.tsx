import { Card, Col, Row, Tag } from 'antd';
import * as React from 'react';
const { Meta } = Card;

interface CardsProps {
  data: any;
  changeServerId: (val: string) => void;
}

const Cards: React.FunctionComponent<CardsProps> = props => {
  const { data, changeServerId } = props;

  return (
    <div>
      <Row gutter={[16, 16]}>
        {[...data].map(item => {
          const { id, name, services, cover, desc } = item;

          return (
            <Col key={id} xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt="example"
                    src={cover}
                    onClick={() => {
                      changeServerId(id);
                    }}
                  />
                }
              >
                <div style={{ position: 'relative' }}>
                  <Meta title={name} description={desc}></Meta>
                  <Tag color={'green'} style={{ position: 'absolute', right: '0px', top: '2px' }}>
                    {id}
                  </Tag>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Cards;
