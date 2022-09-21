// import { Switch } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import './index.less';
import PropertiesDetail from './PropertiesDetail';
import Statistic from './Statistic';
interface PropertiesProps {
  data: any;
  defaultiStatistic: boolean;
}

const Properties: React.FunctionComponent<PropertiesProps> = props => {
  const { data, defaultiStatistic } = props;
  const [state, updateState] = useImmer({
    isStatistic: defaultiStatistic,
  });

  // const onChange = (checked: boolean) => {
  //   updateState(draft => {
  //     draft.isStatistic = checked;
  //   });
  // };

  return (
    <div className="gi-properties-pannel">
      <header className="gi-properties-pannel-header">
        <h3>{data.id}</h3>
        {/* <div>
          图表展示
          <Switch checked={state.isStatistic} onChange={onChange} />
        </div> */}
      </header>
      {state.isStatistic ? <Statistic data={data} /> : <PropertiesDetail data={data} />}
    </div>
  );
};

export default Properties;
