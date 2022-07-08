import { Switch } from "antd";
import * as React from "react";
import { useImmer } from "use-immer";
import PropertiesDetail from "./PropertiesDetail";
import Statistic from "./Statistic";
import "./index.less";
interface PropertiesProps {
  data: any;
}

const Properties: React.FunctionComponent<PropertiesProps> = (props) => {
  const { data } = props;
  const [state, updateState] = useImmer({
    isStatistic: true,
  });

  const onChange = (checked: boolean) => {
    updateState((draft) => {
      draft.isStatistic = checked;
    });
  };

  return (
    <div className="gi-properties-pannel">
      <header className="gi-properties-pannel-header">
        <h3>{data.id}</h3>
        <div>
          统计数据展示
          <Switch checked={state.isStatistic} onChange={onChange} />
        </div>
      </header>
      {state.isStatistic ? (
        <Statistic data={data} />
      ) : (
        <PropertiesDetail data={data} />
      )}
    </div>
  );
};

export default Properties;
