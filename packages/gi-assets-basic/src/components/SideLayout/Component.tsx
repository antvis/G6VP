import React from "react";
import './Component.less';
import GroupContainer, { VerProps } from "../GroupBar/GroupContainer";
export interface Props {
  children?: React.ReactNode;
  containers: {
    id: string;
    name: string;
    background?: string;
    sideMenuWidth?: number | string;
    groups: VerProps['items'] & { components: string[] }
  }[]
}
export default (props: Props) => {
  const { children, containers } = props;
  const { groups = [], background, sideMenuWidth = 80 } = containers.find(container => container.id === 'GI_SIDE_CONTAINER') || {};
  return <div className='gi-side-layout'>
    <div className='gi-side-layout-item'>
      <GroupContainer vertical={true} isSideContent={true} items={groups} style={{ background, width: sideMenuWidth }} wrapperStyle={{ height: '100%' }} />
    </div>
    <div className='gi-side-layout-v'>
      <div className='gi-side-layout-canvas'>
        {
          children
        }
      </div>
    </div>
  </div>
}