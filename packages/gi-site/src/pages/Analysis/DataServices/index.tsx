import { Skeleton } from 'antd';
import { produce } from 'immer';
import * as React from 'react';
import { useImmer } from 'use-immer';
import DataSource from '../../../components/DataSource/index';
import BaseNavbar from '../../../components/Navbar/BaseNavbar';
import { getProjectById, updateProjectById } from '../../../services/index';
interface DataServicesProps {}

const DataServices: React.FunctionComponent<DataServicesProps> = props => {
  //@ts-ignore
  const { history, match } = props;
  const { projectId } = match.params;

  const [state, updateState] = useImmer({
    isReady: false,
    serviceConfig: [],
  });

  React.useEffect(() => {
    getProjectById(projectId).then((res: any) => {
      const { data, serviceConfig } = res;
      console.log(res);
      updateState(draft => {
        draft.isReady = true;
        draft.serviceConfig = serviceConfig;
      });
    });
  }, []);

  const { isReady, serviceConfig } = state;

  const onSave = params => {
    console.log(params, 'params');
    const { id, name, content } = params;

    const newServiceConfig = produce(serviceConfig, draft => {
      const matchService = draft.find(c => {
        return c.id === id;
      });

      if (matchService) {
        matchService.name = name;
        matchService.content = content;
      } else {
        draft.push(params);
      }
    });
    console.log(JSON.stringify(newServiceConfig));

    updateProjectById(projectId, {
      serviceConfig: JSON.stringify(newServiceConfig),
    }).then(res => {
      console.log('result', res);
    });
  };

  console.log('state', state);
  if (!isReady) {
    return <Skeleton />;
  }
  return (
    <div>
      <BaseNavbar />
      <DataSource defaultOptions={serviceConfig} onSave={onSave} />
    </div>
  );
};

export default DataServices;
