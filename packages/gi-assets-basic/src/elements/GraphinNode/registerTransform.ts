import type { GINodeConfig } from '@alipay/graphinsight/lib/typing';
import Graphin from '@antv/graphin';
// 引入资源文件
import iconLoader from '@antv/graphin-icons';
import '@antv/graphin-icons/dist/index.css';
import { scaleLinear } from 'd3-scale';
import merge from 'deepmerge';
import { defaultProps } from './registerMeta';

const icons = Graphin.registerFontFamily(iconLoader);

const getMapping = () => {
  const Mapping = new Map();
  return (enumValue, value) => {
    const current = Mapping.get(enumValue);
    if (current) {
      Mapping.set(enumValue, [...current, value]);
    } else {
      Mapping.set(enumValue, [value]);
    }
    return Mapping;
  };
};

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, metaConfig: GINodeConfig, reset?: boolean) => {
  try {
    /** 解构配置项 */
    const { color: Color, label: Label, size: Size, icon: Icon, halo: Halo, badges: Badges } = Object.assign(
      {},
      defaultProps,
      metaConfig.props,
    );

    /** 分别生成Size和Color的Mapping */
    const mappingBySize = scaleLinear().domain(Size.scale.domain).range(Size.scale.range);

    const mappingByColor = getMapping();

    const nodes = s.nodes.map(node => {
      const { id, data = {} } = node;
      /** 根据Size字段映射的枚举值 */
      const enumValueBySize = data[Size.key || 0];
      const LABEL_VALUE = Label?.enable ? data[Label?.key || 'id'] : '';

      /** 根据Color字段映射的枚举值 */
      const enumValueByColor = data[Color.key || 0];
      const MappingByColor = mappingByColor(enumValueByColor, node);

      /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
      const colorKeys = MappingByColor.keys();
      const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);
      const keyshapeSize = Size?.mapping ? mappingBySize(enumValueBySize) : Size?.fixed;
      const keyShapeColor = Color?.mapping ? Color?.scale?.range?.[matchColorIndex] : Color?.fixed;

      /** 光晕 */
      const halo: { [key: string]: any } = {
        visible: false,
      };

      if (Halo.enable) {
        halo.visible = true;
        halo.lineWidth = Halo.lineWidth;
        halo.fill = keyShapeColor;
        halo.stroke = keyShapeColor;
        halo.strokeOpacity = 1;
        halo.fillOpacity = Halo.opacity;
      }
      /** 徽标 */
      let badges: any[] = [];
      if (Badges.enable) {
        badges.push({
          position: 'RT',
          type: 'text',
          value: data[Badges.key],
          size: Badges.size,
          fill: Badges.fill,
          color: Badges.color,
        });
      }

      /** 图标 */
      let icon: { [key: string]: any } = {
        visible: false,
      };

      if (Icon.enable) {
        icon = {
          type: Icon.type,
          value: data[Icon.key],
        };
        if (Icon.type === 'image') {
          icon.fill = 'transparent';
          icon.size = [keyshapeSize, keyshapeSize];
          icon.clip = { r: keyshapeSize / 2 };
        }

        if (Icon.type === 'font') {
          const iconValue = data[Icon.key] || '';
          icon.type = 'font';
          icon.fontFamily = 'graphin';
          icon.value = icons[iconValue] || '';
          icon.fill = keyShapeColor;
        } else {
          icon.fill = '#fff';
        }
      }

      let preStyle = (node && node.style) || {};
      if (reset) {
        preStyle = {};
      }
      console.log('keyshapeSize', keyshapeSize, 'preStyle', preStyle, node.style);
      return {
        id: node.id,
        ...node,
        data: node.data,
        dataType: node.dataType || 'others',
        type: 'graphin-circle',
        //
        style: merge(
          {
            keyshape: {
              stroke: keyShapeColor,
              fill: keyShapeColor,
              size: keyshapeSize,
              fillOpacity: 0.3,

              strokeOpacity: 1,
            },
            label: {
              value: Label?.enable ? data[Label?.key || 'id'] || id : '',
              offset: [0, 10],
              fill: Label.color,
            },
            icon,
            halo: { visible: false },
            badges,
            status: {
              normal: {
                halo,
              },
              hover: {
                halo,
              },
              active: {
                halo,
              },
              select: {
                halo,
              },
              highlight: {
                keyshape: {
                  lineWidth: 4,
                  fillOpacity: 0.6,
                },
              },
              inactive: {
                keyshape: {
                  fillOpacity: 0,
                  strokeOpacity: 0.4,
                },
              },
            },
          },
          preStyle,
        ),
      };
    });

    console.log('%c Graphin Nodes', 'color:red', nodes);

    return nodes;
  } catch (error) {
    console.error('parse transform error:', error);
    return s.nodes;
  }
};
export default transform;
