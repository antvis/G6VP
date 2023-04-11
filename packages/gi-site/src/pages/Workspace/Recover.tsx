import { FileTextOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import * as React from 'react';
const { Dragger } = Upload;

interface RecoverProps {
  onRecover: (params: any) => void;
}
const Recover: React.FunctionComponent<RecoverProps> = props => {
  const { onRecover } = props;
  const [state, setState] = React.useState({
    success: false,
    project: null,
  });
  const { success, project } = state;

  const draggerProps = {
    name: 'file',
    customRequest: async options => {
      const { file, onSuccess, onError } = options;
      let fileData;

      if (!file) {
        return false;
      } else {
        const reader = new FileReader();
        reader.readAsText(file, 'utf-8');
        reader.onload = fileReader => {
          try {
            //@ts-ignore
            fileData = JSON.parse(fileReader.target.result as string);

            setState(preState => {
              return {
                ...preState,
                success: true,
                project: fileData,
              };
            });
            onSuccess('Ok');
          } catch (error) {
            setState(preState => {
              return {
                ...preState,
                success: false,
                project: null,
              };
            });
            onError('Error');
          }
        };
      }
    },
  };

  const handleRecover = () => {
    if (!project) {
      return;
    }
    onRecover && onRecover(project);
  };

  return (
    <>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <Dragger {...draggerProps}>
          <p className="ant-upload-drag-icon">
            <FileTextOutlined />
          </p>
          <p>下载的工作薄文件，可以在这里通过「点击」或者「拖拽」上传恢复</p>
        </Dragger>
        <Button
          type="primary"
          shape="round"
          style={{
            marginTop: '12px',
          }}
          onClick={handleRecover}
          disabled={!success}
        >
          立即恢复项目
        </Button>
      </div>
    </>
  );
};

export default Recover;
