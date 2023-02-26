import * as React from 'react';
import './index.less';

interface RadioNoteProps {
  items: {
    name: string;
    id: string;
    icon: React.ReactNode;
  }[];
  defaultValue?: string;
  value?: string;
  onChange?: (id: string) => void;
}

const RadioNote: React.FunctionComponent<RadioNoteProps> = props => {
  const { items, value, onChange } = props;
  const hasActive = Boolean(value);

  return (
    <ul className="gi-radio-note">
      {items.map(item => {
        const { id, icon, name } = item;
        let activeCls = '';
        if (hasActive) {
          activeCls = id === value ? 'active' : '';
        }
        return (
          <li
            key={id}
            onClick={() => {
              onChange && onChange(id);
            }}
            className={activeCls}
          >
            <div className="icon">{icon}</div>
            <div className="name">{name}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default RadioNote;
