import { Icon } from '@antv/gi-sdk';
import { Col, Modal, Row } from 'antd';
import * as React from 'react';

interface DesscriptionProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

const Desscription: React.FunctionComponent<DesscriptionProps> = props => {
  const { isModalOpen, handleCancel, handleOk } = props;

  return (
    <Modal title="快捷键" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          查询 <Icon type="icon-shortcut" /> F
        </Col>
      </Row>
    </Modal>
  );
};

export default Desscription;
