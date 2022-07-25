import { notification, Skeleton } from 'antd';
import { produce } from 'immer';
import * as React from 'react';
import { useImmer } from 'use-immer';
import DataSource from '../../../components/DataSource/index';
import BaseNavbar from '../../../components/Navbar/BaseNavbar';
import { getSearchParams } from '../../../components/utils';
import { getProjectById, updateProjectById } from '../../../services/index';
interface DataServicesProps {}

const DataServices: React.FunctionComponent<DataServicesProps> = props => {
  //@ts-ignore
  const { match } = props;
  const { projectId } = match.params;
  const { searchParams } = getSearchParams(window.location);

  const serviceId = searchParams.get('serviceId');

  const [state, updateState] = useImmer({
    isReady: false,
    serviceConfig: [],
  });

  React.useEffect(() => {
    getProjectById(projectId).then((res: any) => {
      const { data, serviceConfig } = res;

      updateState(draft => {
        draft.isReady = true;
        draft.serviceConfig = serviceConfig;
      });
    });
  }, []);

  const { isReady, serviceConfig } = state;

  const onSave = params => {
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

    updateProjectById(projectId, {
      serviceConfig: JSON.stringify(newServiceConfig),
    }).then(res => {
      if (res) {
        notification['success']({
          message: '保存成功',
          description: '该服务保存成功，快去分析页面查看～',
        });
      }
    });
  };

  const onDelete = id => {
    const newServiceConfig = produce(serviceConfig, draft => {
      return draft.filter(c => {
        return c.id !== id;
      });
    });
    updateProjectById(projectId, {
      serviceConfig: JSON.stringify(newServiceConfig),
    }).then(res => {
      if (res) {
        notification['success']({
          message: '删除成功',
        });
      }
    });
  };

  if (!isReady) {
    return <Skeleton />;
  }

  if (!serviceId) {
    return <div>NOT FOUND SERVICEID</div>;
  }
  return (
    <div>
      <BaseNavbar active="services" />
      <DataSource defaultOptions={serviceConfig} onSave={onSave} onDelete={onDelete} defaultActiveId={serviceId} />
    </div>
  );
};

export default DataServices;
