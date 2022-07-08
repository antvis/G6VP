import React, { useMemo } from "react";
import { Select } from "antd";
import { useImmer } from "use-immer";
import LineChart from "./Charts/LineChart";
import "./Statistic.less";

interface StatisticProps {
  data: any;
}

interface IState {
  statisticProp?: string;
  xField?: string;
  yField?: string;
}

const Statistic: React.FC<StatisticProps> = (props) => {
  const { data } = props;
  const [state, updateState] = useImmer<IState>({
    statisticProp: undefined,
  });

  const propertyOptions = useMemo(() => {
    return Object.keys(data).filter((prop) => data[prop] instanceof Array);
  }, [data]);

  const xFieldOptions = useMemo(() => {
    if (!state.statisticProp) {
      return [];
    }
    const element = data[state.statisticProp][0];
    if (typeof element !== "object") {
      return [];
    }

    return Object.keys(element);
  }, [state.statisticProp]);

  const yFieldOptions = useMemo(() => {
    if (!state.statisticProp) {
      return [];
    }
    const element = data[state.statisticProp][0];
    if (typeof element !== "object") {
      return [];
    }

    return Object.keys(element);
  }, [state.statisticProp]);

  const handleUpdateStatisticProp = (value: string) => {
    updateState((draft) => {
      draft.statisticProp = value;
    });
  };

  const handleUpdateXField = (value: string) => {
    updateState((draft) => {
      draft.xField = value;
    });
  };

  const handleUpdateYField = (value: string) => {
    updateState((draft) => {
      draft.yField = value;
    });
  };

  return (
    <div className="gi-statistic-panel">
      <div className="gi-statistic-panel-header">
        <Select
          placeholder="选择属性"
          value={state.statisticProp}
          onChange={handleUpdateStatisticProp}
          style={{ width: "100px" }}
        >
          {propertyOptions.map((prop) => (
            <Select.Option value={prop}> {prop}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="X轴字段"
          onChange={handleUpdateXField}
          style={{ width: "100px" }}
        >
          {xFieldOptions.map((x) => (
            <Select.Option value={x}>{x}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Y轴字段"
          onChange={handleUpdateYField}
          style={{ width: "100px" }}
        >
          {yFieldOptions.map((y) => (
            <Select.Option value={y}>{y}</Select.Option>
          ))}
        </Select>
      </div>
      <div className="gi-statistic-chart">
        {state.xField && state.yField && (
          <LineChart
            xField={state.xField}
            yField={state.yField}
            data={data[state.statisticProp!]}
          />
        )}
      </div>
    </div>
  );
};

export default Statistic;
