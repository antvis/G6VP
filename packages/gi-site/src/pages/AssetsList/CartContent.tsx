import { AssetInfo, GIComponentAssets, Icon, template as TEMPLATE, utils } from '@antv/gi-sdk';
import { Button, Divider, Drawer, Form, Input, Tag, notification } from 'antd';
import * as React from 'react';
import { history } from 'umi';
import { queryAssets } from '../../services/assets';
import * as TemplateServices from '../../services/template';
import getComponentsByAssets from '../Analysis/getAssets/getComponentsByAssets';
import $i18n from '../../i18n';
const { CheckableTag } = Tag;
const { TextArea } = Input;

interface CartContentProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const CartContent: React.FunctionComponent<CartContentProps> = props => {
  const { visible, setVisible } = props;
  const [form] = Form.useForm();
  const res = JSON.parse(localStorage.getItem('GI_CART_LIST') || '{}');
  const list = Object.values(res).filter((c: any) => c.checked) as AssetInfo[];
  const keys = list.map(item => item.id);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(keys);

  const handleChange = (id: string, checked: boolean) => {
    const nextSelectedTags = checked ? [...selectedTags, id] : selectedTags.filter(t => t !== id);
    setSelectedTags(nextSelectedTags);
    const prev = JSON.parse(localStorage.getItem('GI_CART_LIST') || '{}');
    localStorage.setItem(
      'GI_CART_LIST',
      JSON.stringify({
        ...prev,
        [id]: {
          ...prev[id],
          checked: checked,
        },
      }),
    );
  };
  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();

      /**  请求资产 */
      const assets = await queryAssets();
      /** 获得services */
      const services = utils.getCombineServices(assets.services!);
      /** 得到资产的运行时配置 */
      const CMPS_CONFIG = getComponentsByAssets(
        assets.components as GIComponentAssets,
        { nodes: [], edges: [] },
        services,
        //@ts-ignore
        {},
        { nodes: [], edges: [] },
        'GI',
      );
      /** 根据清单，拆分不同类型的资产 */
      const KEYS_LAYOUT: string[] = [];
      const KEYS_ELEMENTS: string[] = [];
      const KEYS_COMPONENTS: string[] = [];

      const KEYS_GICC_LAYOUT: string[] = []; //布局容器
      const KEYS_GICC_MENU: string[] = []; //右键菜单容器
      const KEYS_GICC: string[] = []; //内容容器

      const KEYS_GIAC_CONTENT: string[] = []; //内容原子资产
      const KEYS_GIAC_MENU: string[] = []; //菜单原子资产
      const KEYS_GIAC: string[] = []; //原子资产

      list.forEach(item => {
        const { type, id } = item;
        if (type === 'NODE' || type === 'EDGE') {
          KEYS_ELEMENTS.push(id);
          return;
        }
        if (type === 'LAYOUT') {
          KEYS_LAYOUT.push(id);
          return;
        }
        /** 剩下的都是分析组件 */
        KEYS_COMPONENTS.push(id);

        if (type === 'GICC_LAYOUT') {
          KEYS_GICC_LAYOUT.push(id);
        }
        if (type === 'GICC_MENU') {
          KEYS_GICC_MENU.push(id);
        }
        if (type === 'GICC') {
          KEYS_GICC.push(id);
        }
        if (type === 'GIAC') {
          KEYS_GIAC.push(id);
        }
        if (type === 'GIAC_MENU') {
          KEYS_GIAC_MENU.push(id);
        }
        if (type === 'GIAC_CONTENT') {
          KEYS_GIAC_CONTENT.push(id);
        }
      });

      // if (KEYS_GICC_MENU.length !== 0 && KEYS_GIAC_MENU.length === 0) {
      //   notification.warn({
      //     message: '系统默认添加上「右键菜单」缺少资产',
      //     description: '请在「元素交互」中，选择一些可以集成到「邮件菜单」的资产,例如「展开收起」等',
      //   });
      //   return
      // }
      // if (KEYS_GIAC.length !== 0 && KEYS_GICC.indexOf('Toolbar') === -1) {
      //   notification.warn({
      //     message: '缺少「工具栏」容器资产',
      //     description: `系统发现你选购了 ${KEYS_GIAC.join(',')} 等原子资产，请在「容器资产」中，选择一些可以集成到「邮件菜单」的资产,例如「展开收起」等`,
      //   });
      //   return
      // }

      const activeAssetsKeys = {
        /** 追加默认必须存在的资产，防止用户漏选而导致运行报错 */
        components: [
          ...new Set([...KEYS_COMPONENTS, 'Initializer', 'CanvasSetting', 'SegmentedLayout', 'Toolbar', 'ContextMenu']),
        ],

        layouts: [...new Set([...KEYS_LAYOUT, 'Force2'])],
        elements: [...new Set([...KEYS_ELEMENTS, 'SimpleNode', 'SimpleEdge'])],
      };

      let GICC_LAYOUT; // 容器资产的配置详情
      const components: any[] = [];
      CMPS_CONFIG.forEach(c => {
        if (!c) return;
        const item = {
          id: c.id,
          mame: c.name,
          info: c.info,
          props: c.props,
        };
        if (item && activeAssetsKeys.components.indexOf(item.id) !== -1) {
          components.push(item);
          const { type } = item.info;
          if (type === 'GICC_LAYOUT') GICC_LAYOUT = item;
        }
      });

      try {
        // 手动集成「布局容器」「画布容器」的原子资产
        GICC_LAYOUT.props.containers[0].GI_CONTAINER = KEYS_GIAC_CONTENT;
        components.forEach(item => {
          if (item.id === 'ContextMenu') {
            item.props.GI_CONTAINER = KEYS_GIAC_MENU;
          }
          if (item.id === 'Toolbar') {
            item.props.GI_CONTAINER = KEYS_GIAC;
          }
        });
      } catch (error) {
        console.log(error);
      }

      const template = {
        name:
          values.name ||
          $i18n.get({
            id: 'gi-site.pages.AssetsList.CartContent.ThePurchaseListIsAutomatically',
            dm: '选购清单自动创建',
          }),
        desc:
          values.desc ||
          $i18n.get(
            {
              id: 'gi-site.pages.AssetsList.CartContent.TheTemplateAutomaticallyCreatedFrom',
              dm: '从「资产列表/选购清单」中自动创建的模版，包含{KEYSGIACCONTENT}个分析模块，{KEYSGIACLength}个分析能力',
            },
            { KEYSGIACCONTENT: KEYS_GIAC_CONTENT.length, KEYSGIACLength: KEYS_GIAC.length },
          ),

        components: components,
        image: values.image,
        activeAssetsKeys,
        layout: {
          id: activeAssetsKeys.layouts[0],
          props: {},
        },
        nodes: TEMPLATE.nodes,
        edges: TEMPLATE.edges,
        pageLayout: GICC_LAYOUT,
      };

      const isSuccess = await TemplateServices.create(template);
      console.log('isSucess', isSuccess, template);
      if (isSuccess) {
        notification.success({
          message: $i18n.get({
            id: 'gi-site.pages.AssetsList.CartContent.AccordingToTheListThe',
            dm: '根据清单列表，已经成功创建模版',
          }),
        });
        history.push('/workbook/template?tab=my');
      }

      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Drawer
        width={'400px'}
        title={$i18n.get({ id: 'gi-site.pages.AssetsList.CartContent.PurchaseList', dm: '选购清单' })}
        placement="right"
        closable={false}
        onClose={() => {
          setVisible(false);
        }}
        open={visible}
        visible={visible}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <ul style={{ margin: '0px', padding: '0px', height: ' calc(100% - 268px)', overflow: 'scroll' }}>
          {list.map(item => {
            const { id, name, desc, icon } = item as any;
            return (
              <li key={id} style={{ listStyle: 'none', padding: '4px 0px' }}>
                {
                  // 为什么这里  keys  换成 selectedTags 就有问题 hhhhh...
                  <CheckableTag
                    key={id}
                    checked={keys.indexOf(id) > -1}
                    onChange={checked => handleChange(id, checked)}
                  >
                    <Icon type={icon} />
                    &nbsp;{name}
                  </CheckableTag>
                }

                {desc}
              </li>
            );
          })}
        </ul>

        <Divider />

        <div>
          <Form layout={'horizontal'} form={form}>
            <Form.Item
              label={$i18n.get({ id: 'gi-site.pages.AssetsList.CartContent.TemplateName', dm: '模版名称' })}
              name="name"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={$i18n.get({ id: 'gi-site.pages.AssetsList.CartContent.TemplateDescription', dm: '模版描述' })}
              name="desc"
            >
              <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
            <Form.Item
              label={$i18n.get({ id: 'gi-site.pages.AssetsList.CartContent.TemplateIllustration', dm: '模版插画' })}
              name="image"
            >
              <Input placeholder="https://xxx.img" />
            </Form.Item>
          </Form>
          <Button type="primary" style={{ width: '100%' }} onClick={handleOk}>
            {$i18n.get({ id: 'gi-site.pages.AssetsList.CartContent.CreateATemplate', dm: '创建模版' })}
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default CartContent;
