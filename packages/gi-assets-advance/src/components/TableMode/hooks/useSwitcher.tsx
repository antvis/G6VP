import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

// 生成 switcher 所需要的 fields 结构
function generateSwitcherFields(updatedResult) {
  return {
    columns: {
      selectable: true,
      items: updatedResult.columns.items,
    },
  };
}

// 生成 dataCfg fields 结构
function generateFields(updatedResult) {
  return {
    columns: updatedResult.columns.items
      .filter(c => {
        return c.checked !== false;
      })
      .map(c => {
        return c.id;
      }),
  };
}

const useSwitcher = defaultFields => {
  const defaultSwitcherFields = {
    columns: {
      selectable: true,
      items: defaultFields.columns.map(item => {
        return { id: item };
      }),
    },
  };
  const [state, setState] = useState({
    fields: defaultFields,
    switcherFields: defaultSwitcherFields,
  });

  useEffect(() => {
    if (!isEqual(state.fields, defaultFields)) {
      setState(preState => {
        return {
          ...preState,
          fields: defaultFields,
          switcherFields: defaultSwitcherFields,
        };
      });
    }
  }, [defaultFields]);

  const { fields, switcherFields } = state;

  const onSwitch = result => {
    setState(preState => {
      return {
        ...preState,
        fields: generateFields(result),
        switcherFields: generateSwitcherFields(result),
      };
    });
  };
  return {
    fields,
    switcherFields,
    onSwitch,
  };
};

export default useSwitcher;
