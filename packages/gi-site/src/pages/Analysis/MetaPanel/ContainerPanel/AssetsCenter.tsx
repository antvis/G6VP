import { CloseOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { ComponentAsset, Icon } from '@antv/gi-sdk';
import { Avatar, Col, Row, Tag } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { CategroyOptions, otherCategory } from './constants';
import './index.less';

const COLOR_MAP = {
  basic: 'rgb(56, 158, 13)',
  advance: 'rgb(19, 194, 194)',
  scene: 'rgb(83, 29, 171)',
  undefined: '#f50',
};

const colors = [
  { stroke: 'rgb(135, 56, 0, 1)', fill: 'rgb(135, 56, 0, 0.2)' },
  { stroke: 'rgb(173, 139, 0, 1)', fill: 'rgb(173, 139, 0, 0.2)' },
  { stroke: 'rgb(91, 140, 0, 1)', fill: 'rgb(91, 140, 0, 0.2)' },
  { stroke: 'rgb(8, 151, 156, 1)', fill: 'rgb(8, 151, 156, 0.2)' },
  { stroke: 'rgb(9, 88, 217, 1)', fill: 'rgb(9, 88, 217, 0.2)' },
  { stroke: 'rgb(83, 29, 171, 1)', fill: 'rgb(83, 29, 171, 0.2)' },
  { stroke: 'rgb(158, 16, 104, 1)', fill: 'rgb(158, 16, 104, 0.2)' },
  { stroke: 'rgb(37, 64, 0, 1)', fill: 'rgb(37, 64, 0, 0.2)' },
];

interface AssetsCenterProps {
  containerComponent: ComponentAsset; // 资产中心内容对应的父容器资产
  value: ComponentAsset[]; // 当前容器已集成的子资产，用于在资产中心列表中默认选中
  componentsMap: { [id: string]: ComponentAsset }; // 全量资产的 map
  handleUpdate: (containerId: string, asset: ComponentAsset, action?: 'add' | 'remove') => void;
  handleClose: () => void; // 关闭资产中心
}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const { containerComponent, value = [], componentsMap, handleUpdate, handleClose } = props;
  const { id: containerId, name: containerName, candidateAssets = [] } = containerComponent || {};

  const [state, setState] = useImmer({
    assets: candidateAssets, // AssetInfo[]
    checkedCategories: Object.keys(CategroyOptions),
    candidateCategories: Object.keys(CategroyOptions),
    tooltip: {
      visible: false,
    },
  });
  const { assets, checkedCategories, candidateCategories, tooltip } = state;

  React.useEffect(() => {
    setState(draft => {
      draft.candidateCategories = Object.keys(CategroyOptions).filter(key =>
        candidateAssets.find(asset => componentsMap[asset.value].info.category === key),
      );
      if (candidateAssets.find(asset => !componentsMap[asset.value].info.category)) {
        draft.candidateCategories.push('otherCategory');
      }
      draft.candidateCategories.sort((a, b) => (a > b ? 1 : -1));
      draft.checkedCategories = draft.candidateCategories;
      draft.assets = []
        .concat(candidateAssets)
        .sort((a, b) => (componentsMap[a.value].info.category > componentsMap[b.value].info.category ? 1 : -1));
    });
  }, [candidateAssets]);

  const checkedList = value.map(item => item.value);

  const handleClick = assetId => {
    const clickAsset = candidateAssets.find(asset => asset.value === assetId);
    const checked = checkedList.includes(assetId);
    if (clickAsset) handleUpdate(containerId, { value: assetId, label: clickAsset.label }, checked ? 'remove' : 'add');
  };

  const handleFilterByTag = value => {
    setState(draft => {
      if (checkedCategories.length === candidateCategories.length) {
        // 全选状态下，点击一个 = 仅选中一个
        draft.checkedCategories = [value];
      } else if (checkedCategories.length === 1 && checkedCategories.includes(value)) {
        // 若将处于全不选状态下，则全部选中
        draft.checkedCategories = candidateCategories;
      } else if (checkedCategories.includes(value)) {
        // 非全选状态下，若被点击的 tag 类别已是选中状态，则取消其选中
        const idx = checkedCategories.indexOf(value);
        draft.checkedCategories.splice(idx, 1);
      } else {
        // 非全选状态下，若被点击的 tag 类别未选中，则选中
        draft.checkedCategories.push(value);
      }
      draft.assets = candidateAssets
        .filter(assetInfo => {
          const asset = componentsMap[assetInfo.value];
          const { info } = asset;
          if (draft.checkedCategories.includes(info.category)) return true;
          if (!info.category && draft.checkedCategories.includes('otherCategory')) return true;
          return false;
        })
        .sort((a, b) => (componentsMap[a.value].info.category > componentsMap[b.value].info.category ? 1 : -1));
    });
  };

  const handleTooltip = (item = undefined) => {
    if (!item) {
      setState(draft => {
        draft.tooltip = {
          visible: false,
        };
      });
      return;
    }
    const { pkg, version, info } = item;
    const { name, desc } = info;
    const formattedPkg = pkg?.replace('@antv/gi-assets-', '') || '';
    setState(draft => {
      draft.tooltip = {
        visible: true,
        desc,
        title: name,
        pkg: `${formattedPkg}@${version}`,
        pkgColor: COLOR_MAP[formattedPkg],
        img: info.cover,
      };
    });
  };

  return (
    <div className="gi-assets-center-wrapper" style={containerComponent ? { height: '50vh' } : { height: '0vh' }}>
      <Row justify="space-between" align="middle" className="gi-container-config-header">
        <Col className="gi-container-config-title">{`${containerName || ''} - 资产选择器`}</Col>
        <Col>
          <span onClick={() => handleClose()} style={{ float: 'right' }}>
            <CloseOutlined />
          </span>
        </Col>
      </Row>

      <div className="gi-assets-center">
        {/* 筛选 */}
        <Row className="gi-assets-center-filter-wrapper">
          <Col key="title" span={4} style={{ fontSize: '8px', textAlign: 'right' }}>
            分类筛选：
          </Col>
          {candidateCategories.map(key => {
            let option = CategroyOptions[key];
            if (!option) option = otherCategory;
            const { order, name } = option;
            const tagColor = colors[order % colors.length];
            const active = checkedCategories.includes(key);
            return (
              <Col key={key} span={3}>
                <Tag
                  key={key}
                  color={tagColor.fill}
                  className="gi-asset-center-tag gi-asset-center-tag-filter"
                  onClick={() => handleFilterByTag(key)}
                  style={{ opacity: active ? 1 : 0.2 }}
                >
                  <span style={{ color: tagColor.stroke }}>{name}</span>
                </Tag>
              </Col>
            );
          })}
        </Row>
        <CheckCard.Group className="gi-assets-center-assets-cardgroup" multiple value={checkedList}>
          <Row
            gutter={[
              { xs: 4, sm: 6, md: 6, lg: 6 },
              { xs: 4, sm: 6, md: 6, lg: 6 },
            ]}
            style={{ padding: '8px 0px' }}
          >
            {assets.map(assetInfo => {
              const item = componentsMap[assetInfo.value];
              const checked = checkedList.includes(assetInfo.value);
              const { id: assetId, info, name } = item;
              const { icon = 'icon-robot' } = info;
              const tag = CategroyOptions[info.category] || otherCategory;
              const tagColor = colors[tag.order % colors.length];
              return (
                <Col key={assetId} onMouseEnter={() => handleTooltip(item)} onMouseLeave={() => handleTooltip()}>
                  <CheckCard
                    key={assetId}
                    onChange={() => handleClick(assetId)}
                    bordered={false}
                    className="assets-card"
                    style={{
                      backgroundColor: tagColor.fill,
                      background: tagColor.fill,
                      borderColor: checked ? tagColor.stroke : '#fff0',
                    }}
                    title={
                      <div
                        style={{
                          width: '100%',
                          color: tagColor.stroke,
                          display: 'block',
                        }}
                      >
                        {name}
                      </div>
                    }
                    avatar={
                      <Avatar
                        style={{
                          color: tagColor.stroke,
                        }}
                        icon={<Icon type={icon} />}
                      ></Avatar>
                    }
                    value={assetId}
                  />
                </Col>
              );
            })}
          </Row>
        </CheckCard.Group>

        <div className="gi-assets-center-tooltip" style={{ opacity: tooltip.visible ? 1 : 0 }}>
          <h4>{tooltip.title}</h4>
          <p>{tooltip.desc}</p>
          {tooltip.img ? <div style={{ backgroundImage: tooltip.img }} /> : ''}
          <Tag color={tooltip.pkgColor} className="gi-asset-center-tag">
            {tooltip.pkg}
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default AssetsCenter;
