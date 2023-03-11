import { Tree, Spin } from 'antd';
import * as React from 'react';

import { CategroyOptions, otherCategory } from '../../components/AssetsCenter/constants';
import { getSearchParams } from '../../components/utils';
import { ASSETS_KEY } from './index';
import './index.less';

interface DetailProps {
  data: any[];
}

const Detail: React.FunctionComponent<DetailProps> = ({ data }) => {
  const { searchParams, path } = getSearchParams(window.location);
  const [state, setState] = React.useState({
    selectedKeys: searchParams.get(ASSETS_KEY) ? [searchParams.get(ASSETS_KEY)] : [],
    treeData: [],
    docsMap: {},
    isReady: false,
  });

  // 获取 cdn 地址中的资产配置信息
  // const getDocsMap = () => {
  //   return fetch('https://cdn.jsdelivr.net/npm/@antv/gi-mock-data/cdn/assets.json')
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(res => {
  //       return res;
  //     });
  // };
  const fullCategoryOptions = { ...CategroyOptions, 'none-category': otherCategory };
  const categoryMap = Object.keys(fullCategoryOptions).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: {
        ...fullCategoryOptions[curr],
        id: curr,
        title: fullCategoryOptions[curr].name,
        children: [],
        selectable: false,
      },
    };
  }, {});
  const buildData = () => {
    // 先使用资产中注入 docs 的方式，这里暂时注释掉
    // const docsMap = await getDocsMap();
    const docsMap = {};
    data.forEach(item => {
      const assetInfo = {
        ...item,
        key: item.id,
        title: item.name,
      };
      if (categoryMap[item.category]) {
        categoryMap[item.category].children.push(assetInfo);
      } else {
        categoryMap['none-category'].children.push(assetInfo);
      }
      docsMap[item.id] = item;
    });
    const categoryValues: any[] = Object.values(categoryMap);
    const tempData: any[] = categoryValues
      .filter(x => x.children && x.children.length)
      .sort((a, b) => {
        return a.order - b.order;
      });
    setState(preState => {
      return {
        ...preState,
        treeData: tempData,
        selectedKeys:
          state.selectedKeys.length && docsMap[state.selectedKeys[0]]
            ? state.selectedKeys
            : [tempData[0].children[0].key].filter(x => x),
        isReady: true,
        docsMap: docsMap,
      };
    });
  };

  React.useEffect(() => {
    buildData();
  }, [data]);

  return (
    <div className="assets-list-container">
      {state.isReady ? (
        <>
          <Tree
            treeData={state.treeData}
            defaultExpandAll
            selectedKeys={state.selectedKeys || []}
            onSelect={keys => {
              setState(preState => {
                return {
                  ...preState,
                  selectedKeys: keys,
                };
              });
              searchParams.set(ASSETS_KEY, keys[0] as string);
              window.location.hash = `${path}?${searchParams.toString()}`;
            }}
          />
          <div className="assets-list-container-iframe">
            <iframe
              src={`${
                state.docsMap[state.selectedKeys[0]]?.docs || 'https://www.yuque.com/antv/gi/reg9gvnw3ybhzeay'
              }?view=doc_embed&from=asite`}
              style={{
                border: 'none',
                background: 'rgba(255, 255, 255, 0)',
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                height: '100%',
              }}
            ></iframe>
          </div>
        </>
      ) : (
        <Spin style={{ width: '100%', lineHeight: '200px' }} size="large" />
      )}
    </div>
  );
};

export default Detail;
