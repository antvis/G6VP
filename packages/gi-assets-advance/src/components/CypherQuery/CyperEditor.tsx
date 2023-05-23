import React, { useEffect, useMemo, useRef } from 'react';

import { createCypherEditor } from './CypherCodeMirror';
import { defaultCodeMirrorSettings, defaultCypherSchema } from './setting';

interface CyperEditorProps {
  onValueChange: (value) => void;
  inputValue?: string;
  cancelInputValue?: () => void;
}

const CypherEditor: React.FC<CyperEditorProps> = ({ onValueChange, inputValue, cancelInputValue }) => {
  const contianer = useRef(null);

  const triggerAutocompletion = (cm, changed) => {
    if (changed.text.length === 0) {
      return;
    }

    const text = changed.text[0];
    const shouldTriggerAutocompletion =
      text === '.' ||
      text === ':' ||
      text === '[]' ||
      text === '()' ||
      text === '{}' ||
      text === '[' ||
      text === '(' ||
      text === '{' ||
      text === '$';
    if (shouldTriggerAutocompletion) {
      cm.execCommand('autocomplete');
    }

    if (onValueChange) {
      onValueChange(cm.getValue());
    }
  };

  const editor = useMemo(() => {
    const { editor: cypherEditor, editorSupport: cypherEditorSupport } = createCypherEditor(
      contianer.current,
      defaultCodeMirrorSettings,
    );
    if (onValueChange) {
      onValueChange(cypherEditor.getValue());
    }

    cypherEditor.on('change', triggerAutocompletion);

    // @ts-ignore
    cypherEditorSupport.setSchema(defaultCypherSchema);
    return cypherEditor;
  }, [contianer.current]);

  useEffect(() => {
    if (inputValue) {
      editor?.setValue(inputValue);
      cancelInputValue?.();
    }
  }, [inputValue]);

  return <div className="Codemirror-Container" ref={contianer} />;
};

export default CypherEditor;
