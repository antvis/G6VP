import { CheckCard } from '@ant-design/pro-components';
import { Col, Collapse, Row, Tag, Avatar } from 'antd';
import { Icon } from '@antv/gi-sdk';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { queryAssetList } from '../../../../services/assets';
import { useContext } from '../../hooks/useContext';
import './index.less';
import { ComponentAsset } from '@antv/gi-sdk/lib/typing';
import { CategroyOptions, otherCategory } from './constants';

const { Panel } = Collapse;

const COLOR_MAP = {
  basic: 'green',
  advance: 'volcano',
  scene: 'purple',
  undefined: '#f50',
};

const colors = [
  'green',
  'volcano',
  'purple',
  '#f50',
  '#faad14',
  '#13c2c2',
  '#1677ff',
  '#722ed1',
  '#eb2f96',
  '#d4b106',
  '#10239e',
];

interface AssetsCenterProps {
  containerId: string; // 容器 id
  value: ComponentAsset[]; // 当前容器已集成的子资产，用于在资产中心列表中默认选中
  handleUpdate: (containerId: string, asset: ComponentAsset, action?: 'add' | 'remove') => void;
  candidateAssets: ComponentAsset[]; // 允许加入该容器的资产，用于显示在资产中心列表中
}

const AssetsCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const { containerId, value = [], handleUpdate, candidateAssets } = props;

  const [state, setState] = useImmer({
    assets: candidateAssets,
    checkedCategories: Object.keys(CategroyOptions),
    candidateCategories: Object.keys(CategroyOptions),
    tooltip: {
      visible: false,
    },
  });

  React.useEffect(() => {
    setState(draft => {
      draft.candidateCategories = Object.keys(CategroyOptions).filter(key =>
        candidateAssets.find(asset => asset.info.category === key),
      );
      if (candidateAssets.find(asset => !asset.info.category)) draft.candidateCategories.push('otherCategory');
      draft.checkedCategories = draft.candidateCategories;
    });
  }, [candidateAssets]);

  const { assets, checkedCategories, candidateCategories, tooltip } = state;

  const checkedList = value.map(item => item.value);

  const handleClick = assetId => {
    const clickAsset = candidateAssets.find(asset => asset.id === assetId);
    const checked = checkedList.includes(assetId);
    if (clickAsset) handleUpdate(containerId, { value: assetId, label: clickAsset.name }, checked ? 'remove' : 'add');
  };

  const handleFilterByTag = value => {
    setState(draft => {
      if (checkedCategories.length === candidateCategories.length) {
        // 全选状态下，点击一个 = 仅选中一个
        draft.checkedCategories = [value];
      } else if (checkedCategories.includes(value)) {
        // 非全选状态下，若被点击的 tag 类别已是选中状态，则取消其选中
        const idx = checkedCategories.indexOf(value);
        draft.checkedCategories.splice(idx, 1);
      } else {
        // 非全选状态下，若被点击的 tag 类别未选中，则选中
        draft.checkedCategories.push(value);
      }
      draft.assets = candidateAssets.filter(casset => {
        const { info } = casset;
        if (draft.checkedCategories.includes(info.category)) return true;
        if (!info.category && draft.checkedCategories.includes('otherCategory')) return true;
        return false;
      });
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
    <div className="gi-assets-center">
      {/* 筛选 */}
      <div className="gi-assets-center-filter-wrapper">
        <p>分类筛选</p>
        {candidateCategories.map(key => {
          let option = CategroyOptions[key];
          if (!option) option = otherCategory;
          const { order, name } = option;
          const tagColor = colors[order % colors.length];
          const active = checkedCategories.includes(key);
          return (
            <Tag
              key={key}
              color={tagColor}
              className="gi-asset-center-tag gi-asset-center-tag-filter"
              onClick={() => handleFilterByTag(key)}
              style={{ opacity: active ? 1 : 0.2 }}
            >
              {name}
            </Tag>
          );
        })}
      </div>
      <CheckCard.Group multiple value={checkedList}>
        <Row
          gutter={[
            { xs: 4, sm: 6, md: 6, lg: 6 },
            { xs: 4, sm: 6, md: 6, lg: 6 },
          ]}
          style={{ padding: '8px 0px' }}
        >
          {assets.map(item => {
            const { id: assetId, info, name, icon = 'icon-robot' } = item;

            const tag = CategroyOptions[info.category];
            const tagColor = colors[tag.order % colors.length];
            return (
              <Col key={assetId} onMouseEnter={() => handleTooltip(item)} onMouseLeave={() => handleTooltip()}>
                <CheckCard
                  key={assetId}
                  onChange={() => handleClick(assetId)}
                  bordered={false}
                  // TODO 样式调整
                  className="assetsCardStyle"
                  title={
                    <div
                      style={{
                        width: '100%',
                        color: 'var(--text-color)',
                        display: 'block',
                      }}
                    >
                      {name}
                      <Tag color={tagColor} className="gi-asset-center-tag">
                        {tag.name}
                      </Tag>
                    </div>
                  }
                  avatar={
                    <Avatar
                      style={{
                        background: 'var(--primary-color-opacity-1)',
                        color: '#3056E3',
                        fontSize: '28px',
                        width: '40px',
                        height: '40px',
                        lineHeight: '40px',
                      }}
                      icon={<Icon type={icon} />}
                      size={50}
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
  );
};

export default AssetsCenter;
