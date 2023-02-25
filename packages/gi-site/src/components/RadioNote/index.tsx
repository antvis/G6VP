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
  onChange?: (e: { name: string; id: string; icon: React.ReactNode }) => void;
}

const RadioNote: React.FunctionComponent<RadioNoteProps> = props => {
  const { items, value, onChange, defaultValue } = props;

  return (
    <ul className="gi-radio-note">
      {items.map(item => {
        const { id, icon, name } = item;
        return (
          <li
            key={id}
            onClick={() => {
              onChange && onChange(item);
            }}
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
