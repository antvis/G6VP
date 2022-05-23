import * as React from 'react';
import './index.less';
interface RoleSwitchProps {
  roles: any[];
  roleId: string;
  handleChangeRole: (id: string) => void;
}

const RoleSwitch: React.FunctionComponent<RoleSwitchProps> = props => {
  const { roles, roleId, handleChangeRole } = props;
  return (
    <div className="switch">
      {roles.map(role => {
        const isMatch = role.id === roleId;
        return (
          <div className={`item ${isMatch ? 'active' : ''}`} onClick={() => handleChangeRole(role.id)}>
            {role.title}
          </div>
        );
      })}
    </div>
  );
};

export default RoleSwitch;
