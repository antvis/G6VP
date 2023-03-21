import { CloseOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import * as React from 'react';
import './index.less';

interface AssetsSelectorProps {}

/**
 * 一个容器配置 panel 中的集成原子资产的输入框
 * @param props
 * @returns
 */
const AssetsSelector: React.FunctionComponent<AssetsSelectorProps> = props => {
  const { handleFocus, id, assets, selecting, handleRemoveAsset } = props as any;
  return (
    <div className="gi-render-form-assets-wrapper">
      <Row justify="space-between" className="gi-render-form-assets-input-label">
        <Col>集成组件：</Col>
        {selecting ? <Col className="gi-render-form-assets-selecting-label">子组件选择中...</Col> : ''}
      </Row>
      <div
        className={`gi-render-form-assets-input ${selecting ? 'gi-render-form-assets-input-selecting ' : ''}`}
        onClick={() => handleFocus?.(id)}
      >
        {assets?.map((asset, i) => (
          <div key={`c${i}`} className="gi-render-form-asset-item">
            {asset.label}
            <CloseOutlined onClick={() => handleRemoveAsset?.(id, asset)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetsSelector;
