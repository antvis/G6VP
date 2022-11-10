import { useContext } from '@antv/gi-sdk';
import * as React from 'react';

export interface SideTabsProps {
  GI_CONTAINER: string[];
  componentKeys: string[];
}

const ContentContainer: React.FunctionComponent<SideTabsProps> = props => {
  const { componentKeys } = props;

  const { assets, config } = useContext();

  const sortedComponents = React.useMemo(() => {
    return Object.values(assets.components || {}).filter(item => {
      return componentKeys.indexOf(item.info.id) !== -1;
    });
  }, [assets.components, componentKeys]);

  const configMap = React.useMemo(() => {
    return Object.values(config.components || {})
      .filter(item => {
        return componentKeys.indexOf(item.id) !== -1;
      })
      .reduce((acc, curr) => {
        acc[curr.id] = curr.props;
        return acc;
      }, {});
  }, [config.components, componentKeys]);

  return (
    <>
      {sortedComponents.map(item => {
        const { component: Component, info } = item;
        const { id } = info;
        const itemProps = configMap[id];
        return <Component key={id} {...itemProps} />;
      })}
    </>
  );
};

export default ContentContainer;
