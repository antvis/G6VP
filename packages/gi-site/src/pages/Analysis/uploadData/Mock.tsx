import * as React from 'react';
import { Button, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import store, { StateType } from '../redux';
import { updateProjectById } from '../../../services';
import demo from '../../../mock/demo.json';
import { GIDefaultTrans } from './const';

interface mock {
  handleClose: () => void;
}

const Mock: React.FunctionComponent<mock> = props => {
  const { handleClose } = props;
  const global = useSelector((state: StateType) => state);
  const { id } = global;
  const dispatch = useDispatch();
  const [state, setState] = useImmer({
    inputData: [
      {
        uid: 1,
        name: 'mock.js',
        data: demo,
        transfunc: GIDefaultTrans('id', 'source', 'target'),
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
      dispatch({
        type: 'update:key',
        key: Math.random(),
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
