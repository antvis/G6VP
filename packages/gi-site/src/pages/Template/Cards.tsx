import { DeleteOutlined, EllipsisOutlined, ExportOutlined } from '@ant-design/icons';
import { Card, Col, Dropdown, Row, Typography } from 'antd';
import * as React from 'react';
import { history } from 'umi';
import { deleteDataset } from '../../services/dataset';
import { ITemplate } from '../../services/typing';

const { Meta } = Card;
const { Paragraph } = Typography;

interface ICardsProps {
  data: ITemplate[];
}

const Cards: React.FunctionComponent<ICardsProps> = props => {
  const { data } = props;
  const handleClick = id => {
    history.push(`/workbook/template/${id}`);
  };
  const handleDelete = async record => {
    await deleteDataset(record.id);
  };

  const items = [
    {
      label: '删除',
      icon: <DeleteOutlined />,
      key: 'delete',
    },
    {
      label: '分享',
      key: 'share',
      disabled: true,
      icon: <ExportOutlined />,
    },
  ];

  return (
    <Row gutter={16}>
      {data.map(item => {
        const { image, desc, name, id } = item;

        const title = (
          <>
            {name}
            <div style={{ float: 'right' }}>
              <Dropdown menu={{ items }} trigger={['click']}>
                <EllipsisOutlined key="delete" rotate={90} />
              </Dropdown>
            </div>
          </>
        );
        return (
          <Col span={8} key={item.id}>
            <Card
              hoverable
              cover={
                <img
                  alt="cover"
                  src={image || `${window['GI_PUBLIC_PATH']}image/tp_unkown.png`}
                  onClick={() => handleClick(id)}
                />
              }
            >
              <Meta
                title={title}
                description={
                  <Paragraph style={{ margin: 0, height: 65 }} ellipsis={{ rows: 3, expandable: false, tooltip: desc }}>
                    {desc}
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Cards;
