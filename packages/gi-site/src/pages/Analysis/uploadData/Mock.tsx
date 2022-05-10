import { FileTextOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import demo from '../../../mock/demo.json';
import { updateProjectById } from '../../../services';
import { useContext } from '../hooks/useContext';
import { GIDefaultTrans } from './const';

interface mock {
  handleClose: () => void;
}

const Mock: React.FunctionComponent<mock> = props => {
  const { handleClose } = props;
  const { context, updateContext } = useContext();

  const { id } = context;

  const [state, setState] = useImmer({
    inputData: [
      {
        uid: 1,
        name: 'mock.json',
        data: demo,
        transfunc: GIDefaultTrans('id', 'source', 'target', 'UNKNOWN', 'UNKNOWN'),
        enable: true,
      },
    ],
  });
  const handleClick = () => {
    updateProjectById(id, {
      data: JSON.stringify({
        transData: demo,
        inputData: state.inputData,
      }),
    }).then(res => {
      updateContext(draft => {
        draft.key = Math.random();
      });
      handleClose();
    });
  };
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }}>
            <Button icon={<FileTextOutlined />} onClick={handleClick} size="large" />
            <span>样例数据</span>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Mock;
