import React, { useMemo } from "react";
import { useImmer } from "use-immer";
import ChartCard from "./ChartCard";
import "./index.less";

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

  return (
    <div className="gi-statistic-panel">
    {
      propertyOptions.map(prop => <ChartCard statisticProp={prop} data={data}/>)
    }
    </div>
  );
};

export default Statistic;
