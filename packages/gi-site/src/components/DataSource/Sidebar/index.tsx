import { useRequest } from '@alipay/bigfish';
import { Card, Input, Radio } from 'antd';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import { getProjectById, updateProjectById } from '../../../services';
import './index.less';
interface SidebarProps {}

let monacoRef;

const ServiceEditor = props => {
  const { currentId } = props;
  return <div>content {currentId}</div>;
};
const serviceTypes = [
  {
    label: 'API',
    value: 'api',
  },
  {
    label: 'Mock',
    value: 'mock',
  },
];
const defaultOptions = [
  {
    title: 'gi-service-get-intial-graph',
    content: `()=>{}`,
    mode: 'mock',
  },
  {
    title: 'gi-service-get-sub-graph',
    content: `https://gi-services/apis`,
    mode: 'api',
  },
];

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const [state, setState] = useImmer({
    options: defaultOptions,
    currentId: defaultOptions[0].title,
  });
  const { options, currentId } = state;
  const { length } = options;
  const handlePlus = () => {
    const option = {
      title: `user-services-${length}`,
      content: `()=>{}`,
      mode: 'mock',
    };
    setState(draft => {
      draft.options = [...draft.options, option];
      draft.currentId = option.title;
    });
  };

  const { id } = useSelector(state => state);
  const { data: project = {}, run } = useRequest(() => {
    return getProjectById(id);
  });
  const { data, services = {} } = project;
  const { getGraphDataTransform } = services;

  const dispatch = useDispatch();

  const editorDidMount = editor => {
    editor.focus();
  };
  const handleSave = () => {
    const model = monacoRef.editor.getModel();
    const value = model.getValue();
    try {
      updateProjectById(id, {
        ...project,
        services: {
          ...project.services,
          getGraphDataTransform: value,
        },
      }).then(() => {
        dispatch({
          type: 'update:key',
          key: Math.random(),
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    run();
  }, []);

  const handleChangeType = e => {
    const { value } = e.target;
    setState(draft => {
      const opt = draft.options.find(opt => opt.title === currentId);
      opt.mode = value;
    });
  };
  const handleClickSidebar = value => {
    setState(draft => {
      draft.currentId = value;
    });
  };

  const current = options.find(opt => opt.title === currentId);
  const { title, mode, content } = current;

  return (
    <div className="gi-services">
      <ul className="gi-services-sidebar">
        {options.map(c => {
          const { title } = c;
          return (
            <li
              key={title}
              onClick={() => {
                handleClickSidebar(title);
              }}
            >
              {title}
            </li>
          );
        })}
        <li key="plus" onClick={handlePlus}>
          +
        </li>
      </ul>
      <div className="gi-services-editor">
        <Card title="服务详情">
          服务名称： <Input placeholder="Basic usage" value={title} />
          服务类型：
          <Radio.Group options={serviceTypes} onChange={handleChangeType} value={mode} />
          <br />
          服务实现：
          {mode === 'api' && <Input value={content} />}
          {mode === 'mock' && (
            <MonacoEditor
              ref={node => {
                monacoRef = node;
              }}
              width="500px"
              height="500px"
              language="json"
              theme="vs-dark"
              value={content}
              options={{}}
              editorDidMount={editorDidMount}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
