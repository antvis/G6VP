import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
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
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '',
    onChange(info) {
      const { file, fileList } = info;
      const { status, originFileObj } = file;
      if (status !== 'uploading') {
        console.log('uploading', info.fileList);
        if (fileList.length === 0) {
          setState(preState => {
            return {
              ...preState,
              success: false,
            };
          });
        }
      }
      if (status === 'done') {
        const reader = new FileReader();
        reader.onload = fileReader => {
          try {
            const fileData = JSON.parse(fileReader.target.result as string);
            message.success(`${info.file.name} file uploaded successfully.`);
            setState(preState => {
              return {
                ...preState,
                success: true,
                project: fileData,
              };
            });
          } catch (error) {
            setState(preState => {
              return {
                ...preState,
                success: false,
                project: null,
              };
            });
            message.error(`${info.file.name} file parse error.`);
          }
        };
        reader.readAsText(originFileObj, 'utf-8');
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        setState(preState => {
          return {
            ...preState,
            success: false,
            project: null,
          };
        });
      }
    },
  };
  const { success, project } = state;
  const handleRecover = () => {
    if (!project) {
      return;
    }
    onRecover && onRecover(project);
  };

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <Dragger {...uploadProps}>
        请上传项目文件
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
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
  );
};

export default Recover;
