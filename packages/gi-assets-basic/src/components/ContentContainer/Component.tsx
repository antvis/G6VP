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
      // @ts-ignore
      return componentKeys.indexOf(item.info.id) !== -1;
    });
  }, [assets.components, componentKeys]);

  const configMap = React.useMemo(() => {
    return Object.values(config.components || {})
      .filter(item => {
        // @ts-ignore
        return componentKeys.indexOf(item.id) !== -1;
      })
      .reduce((acc, curr) => {
        // @ts-ignore
        acc[curr.id] = curr.props;
        return acc;
      }, {});
  }, [config.components, componentKeys]);

  return (
    <>
      {sortedComponents.map(item => {
        // @ts-ignore
        const { component: Component, info } = item;
        const { id } = info;
        // @ts-ignore
        const itemProps = configMap[id];
        // @ts-ignore
        return <Component key={id} {...itemProps} />;
      })}
    </>
  );
};

export default ContentContainer;
