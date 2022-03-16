import queryString from 'query-string';
import React from 'react';
import { useImmer } from 'use-immer';
import Detail from './Detail';
import './index.less';
import SideList from './List';

const DataSource = React.forwardRef((props, ref) => {
  //@ts-ignore
  const { defaultOptions, onSave, defaultActiveId } = props;

  const [state, setState] = useImmer({
    options: defaultOptions,
    currentId: defaultActiveId,
  });

  React.useImperativeHandle(ref, () => ({
    options: state.options,
  }));

  const { options, currentId } = state;

  const handleAdd = () => {
    const option = {
      id: `MY_SERVICE_${Math.random()}`,
      content: `(data)=>{
        console.log('data',data);
        return data;
      }`,
      mode: 'MOCK',
      name: '未命名的服务名称',
    };
    setState(draft => {
      draft.options = [...draft.options, option];
      draft.currentId = option.id;
    });
  };

  const handleClickSidebar = value => {
    setState(draft => {
      draft.currentId = value;
    });
    try {
      const search = window.location.hash.split('?')[1];
      const { serviceId } = queryString.parse(search) as { serviceId: string };
      const newHref = window.location.href.replace(serviceId, value);
      window.location.href = newHref;
    } catch (error) {
      console.warn(error);
    }
  };
  const handleDelete = id => {
    setState(draft => {
      draft.options = draft.options.filter(c => {
        return c.id !== id;
      });
      draft.currentId = draft.options[0].id;
    });
  };

  const handleSave = opt => {
    const { id, name, mode, content } = opt;
    setState(draft => {
      const opt = draft.options.find(opt => opt.id === currentId);
      opt.id = id;
      opt.name = name;
      opt.mode = mode;
      opt.content = content;
      opt.sourceCode = content;
      draft.currentId = id;
    });
    console.log(opt);
    onSave && onSave(opt);
  };

  const current = options.find(opt => opt.id === currentId) || {};
  // if (!current) {
  //   return <div>NOT FOUND SERVICEID:{currentId} </div>;
  // }
  const { id, mode, content, name } = current;

  return (
    <div className="gi-services">
      <SideList
        options={options}
        activeId={currentId}
        handleDelete={handleDelete}
        handleAdd={handleAdd}
        handleChange={handleClickSidebar}
      />
      <Detail key={currentId} name={name} content={content} id={id} mode={mode} handleSave={handleSave} />
    </div>
  );
});

export default DataSource;
