import React, { useEffect, useRef } from 'react';

import { createCypherEditor } from './CypherCodeMirror';
import { defaultCodeMirrorSettings, defaultCypherSchema } from './setting';

interface CyperEditorProps {
  onValueChange: (value) => void;
}

const CypherEditor: React.FC<CyperEditorProps> = ({ onValueChange }) => {
  const contianer = useRef(null);

  const triggerAutocompletion = (cm, changed) => {
    if (changed.text.length !== 1) {
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

  useEffect(() => {
    const { editor, editorSupport } = createCypherEditor(contianer.current, defaultCodeMirrorSettings);
    if (onValueChange) {
      onValueChange(editor.getValue());
    }

    editor.on('change', triggerAutocompletion);

    // @ts-ignore
    editorSupport.setSchema(defaultCypherSchema);
  }, []);

  return <div className="Codemirror-Container" ref={contianer} />;
};

export default CypherEditor;
