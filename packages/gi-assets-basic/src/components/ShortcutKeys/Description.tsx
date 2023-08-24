import { Icon } from '@antv/gi-sdk';
import { Col, Modal, Row } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';

interface DesscriptionProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

const Desscription: React.FunctionComponent<DesscriptionProps> = props => {
  const { isModalOpen, handleCancel, handleOk } = props;

  return (
    <Modal
      title={$i18n.get({ id: 'basic.components.ShortcutKeys.Description.ShortcutKeys', dm: '快捷键' })}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
        <Col span={12}>
          {$i18n.get({ id: 'basic.components.ShortcutKeys.Description.Query', dm: '查询' })}
          <Icon type="icon-shortcut" /> F
        </Col>
      </Row>
    </Modal>
  );
};

export default Desscription;
