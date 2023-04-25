import { useContext, utils } from '@antv/gi-sdk';
import { message as amessage } from 'antd';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import DG from 'react-draggable';
import { CSSTransition } from 'react-transition-group';
import { useController } from './hooks/useController';
import { query } from '../../services/OpenAIQuery';
import { extractCodeBlocks } from './utils/extractCodeBlocks';
import { Message } from './utils/message';
import { getWelcomeMessage } from './utils/prompt';
import { Dialog } from './Dialog';
import { Header } from './Header';
import { ComponentContext } from './context';
import { SUPPORT_LANGUAGES } from './constants';
import type { CodeBlock } from './utils/extractCodeBlocks';
import './index.less';

/**
 * react-draggable 在 React 18 存在一点类型问题
 * 不这样的话会报错，并导致构建失败
 */
const Draggable: any = DG;

const { getPositionStyles } = utils;

type AssistantProps = {
  apiKey: string;
  draggable: boolean;
  logo: string;
  offset: [number, number];
  placement: string;
  prompt: string;
  serviceId: string;
  size: [number, number];
  welcome: string;
};

const Assistant: React.FC<AssistantProps> = ({
  apiKey,
  draggable,
  logo,
  offset,
  placement,
  prompt,
  serviceId,
  size,
  welcome,
}) => {
  const { services, schemaData, transform, updateContext, largeGraphLimit } = useContext();
  const service = utils.getService(services, serviceId);
  const controller = useController();
  const assistantRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const positionStyles = getPositionStyles(placement, offset);

  const placementStyle = useMemo(() => {
    switch (placement) {
      case 'LB':
        return { left: 0, bottom: 0 };
      case 'RT':
        return { right: 0, top: 0 };
      case 'RB':
        return { right: 0, bottom: 0 };
      case 'LT':
      default:
        return { left: 0, top: 0 };
    }
  }, [placement]);

  /**
   * 查询图数据
   * @param value
   * @returns
   */
  const queryGraph = async (codeBlock: CodeBlock) => {
    if (!service) return false;
    const resultData = await service({
      value: codeBlock.code,
      limit: 25,
    });
    updateContext(draft => {
      const res = transform(resultData);

      if (res.nodes.length === 0) {
        amessage.info('没有查询到数据');
      }

      if (res.nodes.length > largeGraphLimit) {
        draft.largeGraphMode = true;
        draft.largeGraphData = res;
        draft.source = res;
        draft.data = {
          nodes: [],
          edges: [],
        };
        draft.isLoading = false;
        return;
      }

      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
    return true;
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  /**
   * 发送消息及查询图数据
   * @param message
   * @returns
   */
  const sendMessage = async (message: Message) => {
    if (!apiKey) {
      amessage.error('请先设置API Key');
      return false;
    }

    const newMessages = [...messages, message];
    addMessage(message);
    const response = await query(
      newMessages.filter(({ status }) => status !== 'cancel'),
      apiKey,
      controller.signal,
    );

    if (!response) return false;

    addMessage(
      new Message({
        role: response.message.role,
        content: response.message.content,
        status: 'success',
      }),
    );

    const codeBlocks = extractCodeBlocks(response.message.content)
    // 由于目前返回代码格式不是特别稳定，暂不做语言过滤
    // .filter(({ language }) =>
    //   SUPPORT_LANGUAGES.includes(language.toLowerCase()),
    // );

    if (codeBlocks.length) {
      amessage.success('开始查询图数据...');
      // 目前只执行第一个被支持语句的代码块
      return await queryGraph(codeBlocks[0]);
    }

    return true;
  };

  const clearMessages = () => {
    // 保留 reserved 的消息
    setMessages(messages.filter(message => message.reserved));
  };

  /**
   * 更新最后一条消息的状态
   * @param status
   */
  const updateLastMessageStatus = (status: Message['status']) => {
    setMessages(prev => {
      const lastMessage = prev.filter(message => !message.reserved)[prev.length - 1];
      if (lastMessage) {
        lastMessage.status = status;
      }
      return [...prev];
    });
  };

  /**
   * 取消查询
   */
  const abortQuery = () => {
    controller.abort();
    updateLastMessageStatus('cancel');
    setLoading(false);
  };

  useEffect(() => {
    if (schemaData) {
      setMessages(prev => [...prev.splice(2, prev.length), ...getWelcomeMessage(welcome, prompt, schemaData)]);
    }
  }, [schemaData, welcome, prompt]);

  return (
    <Draggable
      disabled={!draggable}
      onStart={() => {
        setTimeout(() => {
          setIsDragging(true);
        }, 100);
      }}
      onStop={() => {
        setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }}
      bounds=".gi-analysis"
    >
      <div className="assistant" style={positionStyles}>
        <CSSTransition in={!isDialogOpen} timeout={300} classNames="dialog-button" unmountOnExit>
          <div onClick={() => !isDragging && setIsDialogOpen(true)} className="dialog-button">
            <img src={logo} width={size[0]} height={size[1]} alt="logo" />
          </div>
        </CSSTransition>
        <CSSTransition in={isDialogOpen} timeout={300} classNames="dialog" unmountOnExit>
          <div className="dialog-wrapper" ref={assistantRef} style={placementStyle}>
            <div className="dialog-container">
              <ComponentContext.Provider
                value={{
                  loading,
                  setLoading,
                  messages,
                  onSendMessage: sendMessage,
                  onInput: content =>
                    sendMessage(
                      new Message({
                        role: 'user',
                        content,
                      }),
                    ),
                  abortQuery,
                  clearMessages,
                }}
              >
                <Header title="AI 助理" onClose={() => setIsDialogOpen(false)} />
                <Dialog />
              </ComponentContext.Provider>
            </div>
          </div>
        </CSSTransition>
      </div>
    </Draggable>
  );
};

export default Assistant;
