import React from 'react';
import { Button, Space, Divider, Row, Col, Popconfirm } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';

interface IProps {
  assetName: string;
  updateTime?: string;
  assetType: string;
  handlePublish: () => void;
  loading: boolean;
}

const Header: React.FC<IProps> = ({ assetName, assetType, updateTime, handlePublish, loading }) => {
  let publishDom = null;

  if (assetType === '1' || assetType === '4' || assetType === '5') {
    publishDom = (
      <Popconfirm
        title="发布需要3-5分钟的时间，确定要进行发布吗？"
        onConfirm={handlePublish}
        okText="确定"
        cancelText="取消"
      >
        <Button loading={loading} style={{ color: '#000' }}>
          {loading ? '发布中' : '发布'}
        </Button>
      </Popconfirm>
    );
  }

  let timeStr = '';
  if (updateTime) {
    timeStr = moment(updateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  return (
    <Row style={{ height: 48, lineHeight: '48px' }}>
      <Col span={12}>
        <Space>
          <Link to="/market" style={{ color: '#262c33' }}>
            <LeftOutlined style={{ paddingRight: 8, color: '#ccc' }} />
            <span>资产市场</span>
          </Link>
          <Divider type="vertical" />
          {assetName}
        </Space>
      </Col>
      <Col span={12} style={{ textAlign: 'right', paddingRight: 16 }}>
        <Space>
          {updateTime && <span>最近更新时间：{timeStr}</span>}
          {publishDom}
        </Space>
      </Col>
    </Row>
  );
};

export default Header;
