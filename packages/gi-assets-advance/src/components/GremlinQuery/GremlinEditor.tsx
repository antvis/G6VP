import { EditorProvider, MonacoEnvironment } from '@alipay/e2-editor-core';
import dsl from '@alipay/e2-language-gremlin';
import { FormatPainterOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import elementResizeDetectorMaker from 'element-resize-detector';
import React from 'react';
import './index.less';

interface Props {
  initialValue: string;
  isReadOnly?: boolean;
  height?: string | number;
  onCreated?: (editor: any) => void;
  onValueChange?: (content: string) => void;
  onSelectionChange?: (content: string) => void;
}

/**
 * gremlin editor based on E2
 * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/ap3fnc
 */
export const GremlinEditor: React.FC<Props> = props => {
  const { initialValue, isReadOnly = false, height = '100%', onCreated, onValueChange, onSelectionChange } = props;

  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [codeEditor, setCodeEditor] = React.useState<any>(null);

  // 监听 resize 事件
  let erd: elementResizeDetectorMaker.Erd;
  let erdElement: HTMLElement | null;

  const onResize = () => {
    if (codeEditor) {
      codeEditor.layout();
    }
  };

  const installElementResizeDetector = () => {
    erd = elementResizeDetectorMaker({
      strategy: 'scroll',
    });
    // eslint-disable-next-line react/no-find-dom-node
    const node = editorRef && editorRef.current;
    const parentNode = node && node.parentElement;
    erdElement = parentNode;

    if (parentNode) {
      erd.listenTo(parentNode, onResize);
    }
  };

  const uninstallElementResizeDetector = () => {
    if (erd && erdElement) {
      erd.uninstall(erdElement);
    }
  };

  React.useEffect(() => {
    MonacoEnvironment.loadModule(async (container: { load: (arg0: any) => void }) => {
      container.load(dsl);
    });
    MonacoEnvironment.init().then(async () => {
      if (editorRef && editorRef.current) {
        const editorProvider = MonacoEnvironment.container.get<EditorProvider>(EditorProvider);
        const editor = editorProvider.create(editorRef.current, {
          language: 'Gremlin',
          value: initialValue,
          theme: 'GremlinTheme',
          suggestLineHeight: 24,
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 20,
          folding: true,
          wordWrap: 'on',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          readOnly: isReadOnly,
          suggestSelection: 'first',
          wordBasedSuggestions: false,
          suggest: { snippetsPreventQuickSuggestions: false },
          autoClosingQuotes: 'always',
        });

        setCodeEditor(editor.codeEditor);
        installElementResizeDetector();

        if (onCreated) {
          onCreated(editor.codeEditor);
        }

        if (onValueChange) {
          editor.codeEditor.onDidChangeModelContent(() => onValueChange(editor.codeEditor.getValue()));
        }

        if (onSelectionChange) {
          editor.codeEditor.onDidChangeCursorSelection(() => {
            const selection = editor.codeEditor.getSelection();
            //@ts-ignore
            const selected = editor.codeEditor.getModel().getValueInRange(selection);
            onSelectionChange(selected);
          });
        }
      }
    });

    return () => {
      uninstallElementResizeDetector();
      if (codeEditor) {
        codeEditor.dispose();
      }
    };
  }, [editorRef]);

  const doFormat = (): Promise<boolean> => {
    if (!codeEditor) {
      Promise.resolve(false);
    }
    const selection = codeEditor.getSelection();
    const hasSelection = selection && !selection.isEmpty();
    const action = codeEditor.getAction(
      hasSelection ? 'editor.action.formatSelection' : 'editor.action.formatDocument',
    );
    if (action) {
      return new Promise((resolve, reject) => {
        action.run().then(
          () => {
            resolve(true);
          },
          (err: Error) => {
            reject(err);
          },
        );
      });
    }
    return Promise.reject(new Error('format not support'));
  };

  return (
    <>
      <div className="editor-toolbar">
        <Tooltip title="格式化">
          <Button
            style={{ border: 'none' }}
            disabled={isReadOnly}
            onClick={doFormat}
            size="small"
            icon={<FormatPainterOutlined />}
          ></Button>
        </Tooltip>
      </div>
      <div style={{ width: '100%', height }} ref={editorRef} />
    </>
  );
};

export default GremlinEditor;
