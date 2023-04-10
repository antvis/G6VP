import React from 'react';
import { Input } from 'antd';

// 修饰键
const modifierKey = {
  alt: (event: KeyboardEvent) => event.altKey,
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  meta: (event: KeyboardEvent) => {
    return event.metaKey;
  },
};

interface Props {
  value: string;
  onChange: (key: string) => void;
}

const ModifierPicker: React.FC<Props> = ({ value, onChange }) => {
  const [key, setKey] = React.useState(value || 'alt');
  return (
    <Input
      value={key}
      //@ts-ignore
      onKeyDown={(e: KeyboardEvent) => {
        Object.keys(modifierKey).some(key => {
          console.log({
            key,
            value: modifierKey[key](e),
          });
          if (modifierKey[key](e)) {
            setKey(key);
            onChange(key);
            return true;
          }
        });
      }}
    />
  );
};

export default ModifierPicker;
