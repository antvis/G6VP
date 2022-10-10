import { GIAssets, GIComponentConfig } from "@alipay/graphinsight";
import { CaretDownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Select, Tooltip } from "antd";
import * as React from "react";
import ReactDOM from "react-dom";
import { useImmer } from "use-immer";
import QueryContainer from "./QueryContainer";
import "./index.less";

export interface SideTabsProps {
  GI_CONTAINER: string[];
  components: GIComponentConfig[];
  assets: GIAssets;
  /**
   * 是否在画布的外围
   */
  outSideFromCanvas: boolean;
  flexDirection: "row" | "column";
  GISDK_ID: string;
  placement: "LT" | "LB" | "RT" | "RB";
  offset: number[];
  width: string;
  height: string;
  defaultVisible: boolean;
}

const SideTabs: React.FunctionComponent<SideTabsProps> = (props) => {
  const {
    components,
    assets,
    placement,
    offset,
    width,
    height,
    defaultVisible,
    outSideFromCanvas,
    GISDK_ID
  } = props;
  
  const sortedComponents = React.useMemo(() => {
    return components
      .sort((a, b) => (a.props?.GI_CONTAINER_INDEX || 0) - (b.props?.GI_CONTAINER_INDEX || 0))
      .filter((item) => item && item.props && item.props.GIAC_CONTENT);
  }, [components]);

  const componentOptions = React.useMemo(() => {
    return sortedComponents.map((cp) => {
      const asset = assets[cp.id];
      const cpInfo = asset?.info;
      if (cpInfo) {
        return {
          ...cpInfo,
          label: cpInfo.name,
          value: cpInfo.id,
          Cp: asset.component,
          cpProps: cp.props
        };
      }
    });
  }, [sortedComponents]);

  const [state, setState] = useImmer<{ currentCp: any }>({
    currentCp: componentOptions[0] || {}
  });

  React.useEffect(() => {
    if (componentOptions.length > 0) {
      setState((draft) => {
        draft.currentCp = componentOptions[0];
      });
    }
  }, [componentOptions.length])

  if (!componentOptions.length) {
    return null;
  }

  const { currentCp } = state;
  const { cpProps, Cp } = currentCp;

  if (!Cp) {
    return null
  }

  const onContentChange = (value: any, option: any) => {
    setState((draft) => {
      draft.currentCp = option;
    });
  };
  const Content = (
    <div className='content'>
      <div className='content-title'>
        <Select
          options={componentOptions}
          onChange={onContentChange}
          defaultValue={componentOptions[0].value}
          bordered={false}
          style={{ width: 200 }}
          suffixIcon={<CaretDownOutlined />}
        />
        <Tooltip title={currentCp.desc} placement='right'>
          <QuestionCircleOutlined />
        </Tooltip>
      </div>
      <div className='content-detail'>
        <Cp {...cpProps} />
      </div>
    </div>
  );

  if (!outSideFromCanvas) {
    return (
      <QueryContainer
        width={width}
        height={height}
        defaultVisible={defaultVisible}
        placement={placement}
        offset={offset}>
        {Content}
      </QueryContainer>
    );
  }
  return ReactDOM.createPortal(
    <QueryContainer
      width={width}
      height={height}
      defaultVisible={defaultVisible}
      placement={placement}
      offset={offset}>
      {Content}
    </QueryContainer>,
    document.getElementById(`${GISDK_ID}-container`) as HTMLElement
  );
};

export default SideTabs;
