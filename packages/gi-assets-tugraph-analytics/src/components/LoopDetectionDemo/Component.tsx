import { UserOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { useCounter, useThrottleFn, useToggle } from 'ahooks';
import { Avatar as AntdAvatar, Button, Dropdown, Input, List, Steps, Typography, message } from 'antd';
import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from 'ahooks';
import { Status, type IStatus } from './components/Status';
import { Edges } from './components/Edges';
import { Loop } from './components/Loop';
import { Nodes } from './components/Nodes';
import { BASE_EDGES_DATA, BASE_NODES_DATA, ENTER_LOOP_EDGE_STYLE, LOOP_EDGE_STYLE } from './constants';
import './styles.less';
import {
  diffLoop,
  getColor,
  loopsToEdges,
  mapNodeToColorIndex,
  parseGraphData,
  validateGraphData,
  validateWebSocketURL,
  type LoopMsg,
  parseLoopData,
} from './utils';

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  url: string;
};

type Message = {
  role: 'send' | 'receive';
  value: string;
};

const CLS_PREFIX = 'loop-detection-demo';

const Avatar = memo(({ role }: Pick<Message, 'role'>) => {
  if (role === 'send') {
    return <AntdAvatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />;
  }

  return <AntdAvatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>Server</AntdAvatar>;
});

const Msg = memo(({ role, value }: Message) => {
  const { nodes, edges, loops } = parseGraphData(value);
  const content = (
    <span className={`${CLS_PREFIX}-list-item-message-content`}>
      <Nodes nodes={nodes.map(node => node)} />
      <Edges edges={edges} />
      {loops.map(loop => (
        <Loop key={loop.join()} nodes={loop.map(id => ({ id }))} />
      ))}
    </span>
  );

  return (
    <div className={`${CLS_PREFIX}-list-item-message`}>
      {role === 'send' && content}
      <Avatar role={role} />
      {role === 'receive' && content}
    </div>
  );
});

export default memo(({ url }: Props) => {
  const { updateContext, transform } = useContext();
  const [socketStatus, setSocketStatus] = useState<IStatus['status']>('waiting');
  const socketRef = useRef<WebSocket>();
  const [inputValue, setInputValue] = useState<string>('');
  const [data, setData] = useState<Message[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const loopsCache = useRef<Set<string>>(new Set([]));
  const loopsRecord = useRef<Set<string>>(new Set([...loopsCache.current]));
  const [testMode, { toggle: toggleTest }] = useToggle<boolean>(false);
  const [testStep, { inc: nextTestStep, reset: resetTextStep }] = useCounter(0);

  const isUrlLegal = useMemo(() => {
    if (!url) return false;
    return validateWebSocketURL(url);
  }, [url]);

  const { run: connect } = useThrottleFn(
    () => {
      if (!isUrlLegal) return;
      if (socketRef.current) {
        if (socketRef.current.url === url && socketRef.current.readyState === WebSocket.CONNECTING) return;
        socketRef.current.close();
      }
      setSocketStatus('connecting');
      try {
        socketRef.current = new WebSocket(url);
      } catch (e) {
        setConnected(false);
        setSocketStatus('failed');
        return;
      }

      socketRef.current.onopen = (event: Event) => {
        // 建立连接后，发送一条消息
        send('WEB_DISPLAY_DATA');
        setSocketStatus('open');
        setConnected(true);
      };
      socketRef.current.onmessage = event => {
        const value = event.data;
        setData(prev => [...prev, { role: 'receive', value }]);
        addLoop(value);
      };
      socketRef.current.onerror = (event: Event) => {
        setConnected(false);
        setSocketStatus('failed');
      };
      socketRef.current.onclose = (event: CloseEvent) => {
        setConnected(false);
        setSocketStatus('closed');
      };
    },
    {
      wait: 2000,
      leading: false,
    },
  );

  const updateGraph = (graphStr: string) => {
    const graph = parseGraphData(graphStr);
    const { nodes, edges } = graph;
    updateContext(draft => {
      draft.data = transform({
        ...draft.data,
        nodes: [
          //  @ts-ignore
          ...draft.data.nodes.filter(node => !nodes.some(n => n.id === node.id)),
          ...nodes.map(({ id, name }) => {
            const color = getColor(mapNodeToColorIndex(id), 'candies');
            return {
              id,
              data: { id, name },
              style: {
                keyshape: {
                  fill: color,
                  fillOpacity: 0.8,
                  stroke: color,
                },
              },
            };
          }),
        ],
        edges: [
          //  @ts-ignore
          ...draft.data.edges.filter(edge => {
            const { source, target } = edge;
            return !edges.some(e => e.source === source && e.target === target);
          }),
          ...edges.map(({ source, target, weight }) => ({
            source,
            target,
            data: { source, target, weight },
          })),
        ],
      });
    });
  };

  const addLoop = (loopStr: string) => {
    // 添加环路不会立即生效，而是等待下一次定时器触发
    loopsCache.current.add(loopStr);
  };

  /**
   * 定时处理环路数据
   */
  useInterval(
    () => {
      const oldLoops = parseLoopData(loopsRecord.current);
      const newLoops = parseLoopData(loopsCache.current);
      const { keep, enter, exit } = diffLoop(oldLoops, newLoops);
      if (enter.length === 0 && exit.length === 0) return;
      const isIn = (edge, lps: LoopMsg[]) => {
        const { source, target } = edge;
        const loopEdges = loopsToEdges(lps);
        return loopEdges.some(loopEdge => loopEdge[0] === source && loopEdge[1] === target);
      };
      updateContext(draft => {
        draft.data = transform({
          ...draft.data,
          edges: draft.data.edges.map(edge => {
            let newEdgeData = {};
            let style = {};
            // 更新属性
            if (isIn(edge, enter)) {
              // 新增环路边
              newEdgeData = {
                enterLoop: 'true',
                isLoopEdge: 'true',
              };
              style = ENTER_LOOP_EDGE_STYLE;
            } else if (isIn(edge, exit)) {
              // 不再是环路边
              newEdgeData = {
                enterLoop: 'false',
                isLoopEdge: 'false',
              };
            } else if (isIn(edge, keep)) {
              // 已有环路边
              newEdgeData = {
                enterLoop: 'false',
                isLoopEdge: 'true',
              };
              style = LOOP_EDGE_STYLE;
            }
            return {
              ...edge,
              style,
              data: { ...edge.data, ...newEdgeData },
            };
          }),
        });
      });
      loopsRecord.current = new Set([...loopsCache.current]);
    },
    1000,
    { immediate: true },
  );

  const send = (value: string) => {
    if (!isUrlLegal) {
      message.error('URL 不可用');
      return;
    }
    if (!testMode) {
      // 批量发送
      socketRef.current?.send(value);
    }
    if (value !== 'WEB_DISPLAY_DATA') {
      setData(prev => [...prev, { role: 'send', value }]);
      updateGraph(value);
    }
  };

  const runTest = fn => {
    fn();
    nextTestStep();
  };

  const reset = () => {
    setData([]);
    updateContext(draft => {
      draft.data = transform({
        ...draft.data,
        nodes: [],
        edges: [],
      });
    });
  };

  useLayoutEffect(() => {
    connect();

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  useEffect(() => {
    if (testMode === false) {
      // 清空测试数据
      updateContext(draft => {
        draft.data = transform({
          ...draft.data,
          nodes: [],
          edges: [],
        });
      });
      resetTextStep();
    }
  }, [testMode]);

  return (
    <div className={CLS_PREFIX}>
      <Status url={url} status={socketStatus} />
      <List
        className={`${CLS_PREFIX}-list`}
        dataSource={data}
        renderItem={({ role, value }) => {
          return (
            <List.Item className={`${CLS_PREFIX}-list-item ${CLS_PREFIX}-list-item-${role}`}>
              <Msg role={role} value={value} />
            </List.Item>
          );
        }}
      />
      <div className={`${CLS_PREFIX}-controller`}>
        <TextArea
          value={inputValue}
          rows={4}
          placeholder="点示例: . 1,name&#10;边示例: - 1,2,0.5 "
          onChange={e => setInputValue(e.target.value)}
        />
        <div className={`${CLS_PREFIX}-controller-btn-group`}>
          <Button
            disabled={!connected}
            type="primary"
            onClick={() => {
              if (!inputValue) return;
              if (!validateGraphData(inputValue)) {
                message.error('输入不合法');
                return;
              }
              if (inputValue) send(inputValue);
              setInputValue('');
            }}
          >
            提交
          </Button>
          <Dropdown
            trigger={['click']}
            disabled={!connected}
            menu={{
              items: [
                { key: 'addNodes', label: '添加点' },
                { key: 'addEdges', label: '添加边' },
                // tugraph 方暂时未实现重置操作
                // { key: 'reset', label: '重置操作' },
              ],
              onClick: ({ key }) => {
                switch (key) {
                  case 'addNodes':
                    send(BASE_NODES_DATA);
                    break;
                  case 'addEdges':
                    send(BASE_EDGES_DATA);
                    break;
                  case 'reset':
                    reset();
                    break;
                  default:
                    break;
                }
              },
            }}
          >
            <Button>选项</Button>
          </Dropdown>
          {socketRef.current && !connected && <Button onClick={connect}>重连</Button>}
          <Button disabled={!connected} onClick={toggleTest}>
            {testMode ? '退出' : '演示'}
          </Button>
        </div>
      </div>
      {testMode && (
        <>
          <Text>使用内置数据进行演示</Text>
          <Steps
            direction="vertical"
            size="small"
            current={testStep}
            items={[
              {
                title: '添加点数据',
                description: '添加一组点到画布',
                cb: () => send(BASE_NODES_DATA),
              },
              {
                title: '添加边数据',
                description: '添加一组边到画布',
                cb: () => send(BASE_EDGES_DATA),
              },
              {
                title: '环路检测',
                description: '手动添加环路结果',
                cb: () => {
                  addLoop('1,2,3,4,1');
                  addLoop('1,2,3,4,5,1');
                },
              },
              {
                title: '添加边',
                description: '添加一条边到画布',
                cb: () => send('- 7,2,1'),
              },
              {
                title: '环路检测',
                description: '手动添加环路结果',
                cb: () => {
                  addLoop('2,3,4,5,6,7,2');
                  addLoop('2,1,5,6,7,2');
                },
              },
            ].map(({ title, description, cb }, index) => ({
              title: (
                <Button disabled={testStep !== index} onClick={() => runTest(cb)}>
                  {title}
                </Button>
              ),
              description,
            }))}
          />
        </>
      )}
    </div>
  );
});
