import { useContext } from '@antv/gi-sdk';
import { createUuid } from '@antv/gi-sdk/lib/process/common';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { CheckCircleFilled, PictureOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Modal, Popover, Timeline, Tooltip } from 'antd';
import { ColorMap, LabelMap, circleNodeStyle, getHistoryNode } from './util';
import FlowGraph from './FlowGraph';
import ParamterizePanel from './ParamterizePanel';
import { original } from 'immer';
import { TemplateData, TemplateNode } from './type';
import './index.less';
import $i18n from '../../i18n';

export interface TemplateModalProps {
  // 沉淀历史弹窗是否打开
  open: boolean;
  // screenshot base64 的 map
  urlMap: { [key: string]: string };
  // 从服务端获取的模版列表
  templates: TemplateData[];
  // 保存模版
  handleSave: (historyGraphData: TemplateData, name: string, description?: string) => void;
  // 关闭当前弹窗
  handleClose: () => void;
}

/**
 * 沉淀历史记录模版的弹窗
 * @param props
 * @returns
 */
const TemplateModal: React.FC<TemplateModalProps> = props => {
  const [form] = Form.useForm();
  const { history } = useContext();
  const { open, urlMap, handleSave, handleClose } = props;

  const [state, updateState] = useImmer({
    // 在时间轴上选中的历史记录 id 列表
    checkedRecordIds: [] as string[],
    // 当前选中正在编辑的历史记录节点
    configuring: undefined as TemplateNode | undefined,
    // 当前编辑中的图数据
    graphData: { nodes: [], edges: [], id: '', name: '' } as TemplateData,
    // 时间轴上提示点选历史记录加入模版图的提示的可见性
    timelineTooltipVisible: false,
    // 保存按钮的为模版命名的 popover 的可见性
    savePopoverOpen: false,
  });

  const { checkedRecordIds = [], configuring, graphData, timelineTooltipVisible, savePopoverOpen } = state;

  /**
   * 打开弹窗时，进行时间轴可点选的提示
   */
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        toggleTimelineTooltipVisible(true);
        setTimeout(() => {
          toggleTimelineTooltipVisible(false);
        }, 5000);
      }, 500);
    } else {
      toggleTimelineTooltipVisible(false);
    }
  }, [open]);

  /**
   * 生成模版图的数据
   * 选中的历史记录变化时，向当前编辑的图中增加节点
   */
  React.useEffect(() => {
    const edges: any = [];
    const nodes: any = [
      {
        id: 'start',
        label: $i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Start', dm: '开始' }),
        ...circleNodeStyle,
      },
      {
        id: 'end',
        label: $i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.End', dm: '结束' }),
        ...circleNodeStyle,
      },
    ];

    if (!history?.length || !checkedRecordIds?.length) {
      updateState(draft => {
        draft.configuring = undefined;
        draft.graphData = {
          id: createUuid(),
          name: createUuid(),
          nodes,
          edges: [
            {
              id: `start-end`,
              source: 'start',
              target: 'end',
              style: { lineDash: [4, 4] },
            },
          ],
        };
      });
      return;
    }
    let lastNodeId = 'start';
    history.forEach(item => {
      const { id, success } = item;
      // 向模版图中加入选中的、执行成功的节点
      if (!checkedRecordIds.includes(id) || !success) return;
      edges.push({
        id: `${lastNodeId}-${id}`,
        source: lastNodeId,
        target: id,
      });
      lastNodeId = id;
      nodes.splice(nodes.length - 2, 0, getHistoryNode(item, urlMap));
    });
    edges.push({
      id: `edge-${Math.random()}`,
      source: lastNodeId,
      target: 'end',
    });
    updateState(draft => {
      draft.configuring = undefined;
      draft.graphData = {
        id: createUuid(),
        name: createUuid(),
        nodes,
        edges,
      };
    });
  }, [history, checkedRecordIds]);

  /**
   * 控制时间轴 tooltip 的可见性
   * @param visible
   */
  const toggleTimelineTooltipVisible = visible => {
    updateState(draft => {
      draft.timelineTooltipVisible = visible;
    });
  };

  /**
   * 点选时间轴上的记录条目时的响应
   * @param id
   */
  const handleCheck = id => {
    updateState(draft => {
      const newArr = [...checkedRecordIds];
      if (newArr.includes(id)) {
        const idx = newArr.indexOf(id);
        newArr.splice(idx, 1);
        draft.checkedRecordIds = newArr;
      } else {
        draft.checkedRecordIds = newArr.concat(id);
      }
    });
  };

  /**
   * 更新模版图上某节点（非查询类节点）的参数化配置
   * @param id
   * @param fieldName
   * @param parameterize
   */
  const handleUpdateParameterize = (id, fieldName, parameterize) => {
    updateState(draft => {
      let model;
      draft.graphData.nodes?.forEach(node => {
        if (node.id === id) {
          model = JSON.parse(JSON.stringify(original(node)));
          if (parameterize) {
            (model.parameterized as any)[fieldName] = `\$\{${fieldName}}`;
          } else {
            delete (model.parameterized as any)[fieldName];
          }
          node.parameterized = model.parameterized;
        }
      });
      if (model) draft.configuring = model;
    });
  };

  /**
   * 更新模版图上查询类节点的查询语句参数化配置
   * @param id 历史记录的 id
   * @param fieldName 查询语句在查询组件中的 prop 名称
   * @param parameterizePosition 在原始查询语句字符串中，需要参数化开始和结束位置
   * @param parameterName 参数化后的名字
   * @param parameterDescription 参数化后的辅助描述
   */
  const handleUpdateQueryParameterize = (id, fieldNames, parameterizePosition, parameterName, parameterDescription) => {
    updateState(draft => {
      let model;
      draft.graphData.nodes?.forEach(node => {
        if (node.id === id) {
          model = JSON.parse(JSON.stringify(original(node)));
          (model.parameterized as any)[fieldNames[0]] = (model.parameterized as any)[fieldNames[0]] || [];
          (model.parameterized as any)[fieldNames[0]].push({
            position: {
              ...parameterizePosition,
              paths: [...fieldNames].splice(1),
            },
            parameterName,
            parameterDescription,
            fieldName: fieldNames[0],
          });
          node.parameterized = model.parameterized;
        }
      });
      if (model) draft.configuring = model;
    });
  };

  /**
   * 更新一个模版节点的辅助描述
   * @param id 模版节点 id
   * @param desc 辅助描述
   */
  const handleUpdateDescription = (id, desc) => {
    updateState(draft => {
      draft.graphData.nodes?.forEach(node => {
        if (node.id === id) {
          node.description = desc;
        }
      });
    });
  };

  /**
   * 控制“保存”按钮的 popover（内容为模版命名和描述文案输入）
   * @param visible 可见性
   */
  const handleSavePopoverOpenChange = visible => {
    updateState(draft => {
      draft.savePopoverOpen = visible;
    });
  };

  /**
   * 保存当前编辑中的模版
   */
  const handleSaveTemplate = () => {
    form.validateFields().then(values => {
      const { templateName, templateDesc } = values;
      handleSavePopoverOpenChange(false);
      handleCloseModal();
      handleSave(graphData, templateName, templateDesc);
    });
  };

  const handleCloseModal = () => {
    toggleTimelineTooltipVisible(false);
    handleClose();
  };

  /**
   * 保存按钮，包括填写名称和描述的 popover
   */
  const saveBtn =
    graphData?.nodes.length < 3 ? (
      <Tooltip
        title={$i18n.get({
          id: 'advance.components.AnalysisHistory.TemplateModal.ThereIsNoContentTo',
          dm: '暂无可保存内容，请先将历史记录加入模版图',
        })}
      >
        <Button type="primary" disabled>
          {$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Save', dm: '保存' })}
        </Button>
      </Tooltip>
    ) : (
      <Popover
        content={
          <Form form={form}>
            <Form.Item
              label={$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Name', dm: '名称' })}
              name="templateName"
              rules={[
                {
                  required: true,
                  message: $i18n.get({
                    id: 'advance.components.AnalysisHistory.TemplateModal.NameTheTemplate',
                    dm: '请为模版命名',
                  }),
                },
              ]}
            >
              <Input
                placeholder={$i18n.get({
                  id: 'advance.components.AnalysisHistory.TemplateModal.EnterATemplateName',
                  dm: '输入模版名',
                })}
              />
            </Form.Item>
            <Form.Item
              label={$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Description', dm: '描述' })}
              name="templateDesc"
            >
              <Input
                placeholder={$i18n.get({
                  id: 'advance.components.AnalysisHistory.TemplateModal.AuxiliaryDescription',
                  dm: '辅助描述',
                })}
              />
            </Form.Item>
            <Button type="primary" disabled={graphData?.nodes.length < 3} onClick={handleSaveTemplate}>
              {$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Ok', dm: '确定' })}
            </Button>
          </Form>
        }
        title={$i18n.get({
          id: 'advance.components.AnalysisHistory.TemplateModal.NameTheTemplate',
          dm: '请为模版命名',
        })}
        trigger="click"
        open={savePopoverOpen}
        onOpenChange={handleSavePopoverOpenChange}
      >
        <Tooltip
          title={$i18n.get({
            id: 'advance.components.AnalysisHistory.TemplateModal.AnalysisTemplatesStoredAsWorkbook',
            dm: '存储为工作簿的分析模版',
          })}
        >
          <Button type="primary">
            {$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Save', dm: '保存' })}
          </Button>
        </Tooltip>
      </Popover>
    );

  return (
    <Modal
      title={$i18n.get({
        id: 'advance.components.AnalysisHistory.TemplateModal.PrecipitationAnalysisHistory',
        dm: '沉淀分析历史',
      })}
      width="80%"
      open={open}
      maskClosable={false}
      onCancel={handleCloseModal}
      footer={[
        <Tooltip
          title={$i18n.get({
            id: 'advance.components.AnalysisHistory.TemplateModal.SaveAndCloseTheDialog',
            dm: '暂存并关闭对话框',
          })}
        >
          <Button style={{ margin: '0 8px' }} onClick={handleCloseModal}>
            {$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.Close', dm: '关闭' })}
          </Button>
        </Tooltip>,
        saveBtn,
      ]}
    >
      {!history?.length ? (
        <Empty
          description={$i18n.get({
            id: 'advance.components.AnalysisHistory.TemplateModal.NoHistoryIsAvailablePlease',
            dm: '暂无历史记录，请先对图进行操作',
          })}
        />
      ) : (
        <div className="gi-history-modal-wrapper">
          <div className="gi-history-modal-timeline-wrapper">
            <h3 className="gi-history-modal-title">
              {$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateModal.OperationHistory', dm: '操作历史' })}
            </h3>
            <Timeline>
              {history?.map((item, i) => {
                const { id, type, subType, statement, timestamp } = item;
                const date = new Date(timestamp);
                const dot = checkedRecordIds.includes(id) ? (
                  <CheckCircleFilled style={{ fontSize: '16px' }} onClick={() => handleCheck(id)} />
                ) : (
                  <a
                    className="gi-history-modal-timeline-dot-uncheck"
                    style={{ border: `2px solid ${ColorMap[type]}` }}
                    onClick={() => handleCheck(id)}
                    onMouseLeave={() => toggleTimelineTooltipVisible(false)}
                  />
                );

                return (
                  <Timeline.Item
                    color={ColorMap[type]}
                    dot={
                      i === 0 ? (
                        <Tooltip
                          title={$i18n.get({
                            id: 'advance.components.AnalysisHistory.TemplateModal.SelectRecordsOnTheTimeline',
                            dm: '在时间轴上勾选记录，可加入分析链路模版中',
                          })}
                          placement="topLeft"
                          open={timelineTooltipVisible}
                        >
                          {dot}
                        </Tooltip>
                      ) : (
                        dot
                      )
                    }
                  >
                    <span className="gi-analysis-history-statement">
                      {LabelMap[type]} ({subType}): {statement}
                    </span>
                    <span className="gi-analysis-history-time">
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </span>
                    {urlMap[id] ? (
                      <Popover
                        placement="right"
                        style={{ width: 'fit-content', height: 'fit-content' }}
                        content={<img src={urlMap[id]} style={{ width: '300px' }} />}
                      >
                        <PictureOutlined className="gi-analysis-history-screenshot-icon" style={{ marginTop: 0 }} />
                      </Popover>
                    ) : (
                      ''
                    )}
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
          <div className="gi-history-modal-graph-wrapper">
            <h3 className="gi-history-modal-title">
              {$i18n.get({
                id: 'advance.components.AnalysisHistory.TemplateModal.AnalysisLinkTemplate',
                dm: '分析链路模版',
              })}
            </h3>
            <div className="gi-history-modal-graph-area">
              <FlowGraph
                graphData={graphData}
                urlMap={urlMap}
                configuring={configuring}
                setConfiguring={conf =>
                  updateState(draft => {
                    draft.configuring = conf;
                  })
                }
              />

              <ParamterizePanel
                graphData={graphData}
                configuring={configuring}
                updateParameterize={handleUpdateParameterize}
                updateQueryParameterize={handleUpdateQueryParameterize}
                updateDescription={handleUpdateDescription}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TemplateModal;
