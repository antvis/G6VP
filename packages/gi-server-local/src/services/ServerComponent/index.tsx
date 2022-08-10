import { Steps } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ConfigData from './ConfigData';
import './index.less';
import { IState, ServerComponentProps } from './typing';
import UploadLocalFile from './UploadLocalFile';
import { GIDefaultTrans } from './utils';

const { Step } = Steps;

const ServerComponent: React.FC<ServerComponentProps> = props => {
  const { updateGISite, giSiteContext } = props;
  const [state, updateState] = useImmer<IState>({
    activeKey: 0,
    inputData: [],
    data: {
      nodes: [],
      edges: [],
    },
    transfunc: GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'),
    transData: eval(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'))({ nodes: [], edges: [] }),
    tableData: [],
    transColumns: [],
  });

  const steps = [
    {
      title: '上传数据',
      content: <UploadLocalFile state={state} updateState={updateState} />,
    },
    {
      title: '配置字段',
      content: (
        <ConfigData state={state} updateState={updateState} updateGISite={updateGISite} giSiteContext={giSiteContext} />
      ),
    },
  ];

  return (
    <>
      <Steps current={state.activeKey} type="navigation">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[state.activeKey].content}</div>
      <div className="steps-action"></div>
    </>
  );
};

export default ServerComponent;
