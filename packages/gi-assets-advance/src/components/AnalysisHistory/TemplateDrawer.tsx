import { useContext } from '@antv/gi-sdk';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { CaretRightOutlined, PauseOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Select, Tooltip } from 'antd';
import FlowGraph from './FlowGraph';
import ConfigurePanel from './ConfigurePanel';
import { TemplateData, TemplateNode } from './type';
import { useMemoizedFn } from 'ahooks';

import './index.less';
import { updateObjWithPaths } from './util';
import $i18n from '../../i18n';

let stepTimer: any = 0;

export interface TemplateDrawerProps {
  open: boolean;
  templates: TemplateData[];
  urlMap: { [key: string]: string };
  handleClose: () => void;
  handleUpdateConfigure: (templateId: string | undefined, nodeId: string, values) => void;
}

type ApplyWay = 'autoSteps' | 'controlledSteps';
type RunningStatus = 'none' | 'running' | 'success' | 'failed' | 'finish' | undefined;

/**
 * 应用模版时的配置抽屉
 * @param props
 * @returns
 */
const TemplateDrawer: React.FC<TemplateDrawerProps> = props => {
  const { open, templates, urlMap, handleClose, handleUpdateConfigure } = props;
  const { updateContext, history } = useContext();

  const [state, updateState] = useImmer({
    activeTemplateId: undefined as string | undefined,
    configuring: undefined as TemplateNode | undefined,
    applyBtnTooltipVisible: false,
    // 当前的执行方式
    applyWay: 'autoSteps' as ApplyWay,
    // 当前运行的节点 idx，-1 代表 start，>= 0 代表 nodes 中的 idx
    currentStep: -1,
    // 正在运行的节点 id
    runningId: undefined as string | undefined,
    // 出现错误的信息列表，每项包括节点 id 和错误信息
    errorInfos: [] as { id: string; msg: string }[],
    // 运行成功的节点 id 数组
    successIds: [] as string[],
    // 当前的运行状态，none 不在运行中，running 正在运行中，success 当前节点运行成功，failed 当前节点运行失败
    runningStatus: 'none' as RunningStatus,
    // 是否正在进行自动执行
    autoRunning: false,
  });

  const {
    activeTemplateId,
    applyWay,
    currentStep,
    configuring,
    runningId,
    errorInfos,
    successIds,
    runningStatus,
    autoRunning,
  } = state;

  /**
   * 按照发生时间排序的模版图节点列表
   */
  const nodes = React.useMemo(() => {
    const template = templates?.find(template => template.id === activeTemplateId);
    if (!template) return [];
    return template.nodes
      .filter(node => node.id !== 'start' && node.id !== 'end')
      .sort((a, b) => a.content?.timestamp - b.content?.timestamp);
  }, [activeTemplateId, templates]);

  /**
   * 抽屉被打开时，显示 tooltip，关闭时隐藏（若仍显示）
   */
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        updateState(draft => {
          draft.applyBtnTooltipVisible = true;
        });
        setTimeout(() => {
          updateState(draft => {
            draft.applyBtnTooltipVisible = false;
          });
        }, 5000);
      }, 500);
    } else {
      updateState(draft => {
        draft.applyBtnTooltipVisible = false;
      });
    }
  }, [open]);

  /**
   * 接收历史记录的变更，判断当前历史记录节点是否运行成功，若成功则可继续运行下一步节点
   */
  React.useEffect(() => {
    if (!history?.length) return;
    const { success, errorMsg } = history[history.length - 1];
    if (!runningId) return;
    // 正在进行自动运行，根据上一步的状态决定是否进行下一步
    if (success) {
      // 上一步运行成功
      if (applyWay === 'autoSteps' && autoRunning) {
        if (currentStep < nodes.length) {
          // 一秒后继续执行，handleApplyStep 中判断是否结束
          stepTimer = setTimeout(() => {
            handleApplyStep();
          }, 1000);
        }
      }
      // 更新执行状态
      updateState(draft => {
        draft.runningStatus = 'success';
        draft.errorInfos = [];
        draft.successIds = [...successIds, runningId];
      });
    } else if (!success) {
      // 上一步运行失败，暂停运行
      updateState(draft => {
        draft.errorInfos = [
          ...errorInfos,
          {
            id: runningId,
            msg: errorMsg,
          },
        ];

        draft.runningId = undefined;
        draft.runningStatus = 'failed';
      });
    }
  }, [history]);

  /**
   * 模版列表变更，设置第一个模版为正在使用中的模版
   */
  React.useEffect(() => {
    if (!templates?.length || activeTemplateId) return;
    const defaultId = templates[0].id;
    updateState(draft => {
      draft.activeTemplateId = defaultId;
    });
  }, [templates]);

  /**
   * 重置运行步骤
   */
  const resetStep = (finished = false) => {
    if (stepTimer) {
      clearTimeout(stepTimer);
      stepTimer = 0;
    }
    updateState(draft => {
      draft.errorInfos = [];
      draft.runningStatus = finished ? 'finish' : 'none';
      draft.runningId = 'start';
      draft.successIds = [];
      draft.currentStep = runningStatus === 'failed' ? currentStep : -1;
      draft.autoRunning = false;
    });
  };

  /**
   * 执行下一步模版图节点
   */
  const handleApplyStep = useMemoizedFn(() => {
    let step = currentStep + 1;
    if (step >= nodes.length) {
      resetStep(true);
    } else {
      const lastStep = runningStatus === 'finish' ? nodes.length - 1 : currentStep;
      runStep(nodes[step], nodes[lastStep]);
      updateState(draft => {
        draft.currentStep = step;
        draft.runningStatus = 'running';
      });
    }
  });
  /**
   * 自动运行所有节点，该函数仅运行第一个，后续在 history 变化的 effect 中
   * 根据上一步执行状态决定是否自动执行下一步，若发生错误则停止自动执行
   */
  const handleApplyAuto = useMemoizedFn(interval => {
    updateState(draft => {
      draft.runningId = 'start';
      draft.successIds = [];
      draft.autoRunning = true;
    });
    // 执行第一步，后续在 history 的 effect 监听中执行，即完成前一步后再执行后一步
    stepTimer = setTimeout(() => {
      updateState(draft => {
        draft.successIds = ['start'];
      });
      handleApplyStep();
    }, interval);
  });

  /**
   * 执行指定的历史记录节点
   * @param node 需要运行的模版图节点
   * @param lastNode 上一个被运行的模版图节点
   */
  const runStep = (node: TemplateNode, lastNode?: TemplateNode) => {
    const { params, parameterized, configured = {}, componentId, content } = node;
    const { componentId: lastComponentId } = lastNode || {};
    updateState(draft => {
      draft.runningId = node.id;
    });
    let foundComponent = false;
    updateContext(draft => {
      draft.config.components.forEach(item => {
        if (lastComponentId && item.id === lastComponentId) {
          item.props.controlledValues = undefined;
        }
        if (item.id !== componentId) return;
        // 需要一个 seed 强制更新，避免两个节点参数相同，无法分析组件触发更新的问题
        const controlledValues = { seed: Math.random() };
        Object.keys(params).forEach(field => {
          const oriValue = params[field];
          const isPart = ((content as any).type === 'query' && field === 'value') || typeof oriValue === 'object';
          if (isPart) {
            let finalValue = typeof oriValue !== 'string' ? JSON.parse(JSON.stringify(oriValue)) : '';
            let lastEnd = 0;
            if (parameterized[field]) {
              Object.values(parameterized[field] as object).forEach((paramInfo: any) => {
                const { position, parameterName } = paramInfo;
                const { start, end, content, paths } = position;
                const paramterValue = configured[`${node.id}-${field}-${paths.join('-')}-${parameterName}`] || content;
                if (typeof oriValue !== 'string') {
                  updateObjWithPaths(finalValue, paths, paramterValue);
                } else {
                  finalValue = `${finalValue}${oriValue.substring(lastEnd, start - lastEnd)}${paramterValue}`;
                }
                lastEnd = end;
              });
            }
            if (typeof oriValue === 'string') {
              finalValue = `${finalValue}${oriValue.substring(lastEnd)}`;
            }
            controlledValues[field] = finalValue;
          } else {
            controlledValues[field] =
              parameterized[field] && configured[`${node.id}-${field}-${field}`]
                ? configured[`${node.id}-${field}-${field}`]
                : params[field];
          }
        });
        item.props.controlledValues = controlledValues;
        foundComponent = true;
      });
      if (!foundComponent) {
        // 未找到对应组件，运行失败
        updateState(draft => {
          draft.errorInfos = [
            ...errorInfos,
            {
              id: node.id,
              msg: $i18n.get(
                {
                  id: 'advance.components.AnalysisHistory.TemplateDrawer.AssetComponentidIsNotFound',
                  dm: '未找到资产 {componentId}，请先将它配置到画布中',
                },
                { componentId: componentId },
              ),
            },
          ];

          draft.runningId = undefined;
          draft.runningStatus = 'failed';
        });
      }
    });
  };

  /**
   * 模版变更
   * @param value
   */
  const handleTemplateChange = value => {
    updateState(draft => {
      draft.activeTemplateId = value;
      draft.configuring = undefined;
    });
    resetStep(runningStatus === 'finish');
  };

  /**
   * 运行按钮，根据运行方式、运行状态不同，运行按钮有不同的形态及响应函数
   */
  const applyButton = React.useMemo(() => {
    const style = { height: '32px', width: '83px', borderRadius: '0 8px 8px 0' };
    switch (applyWay) {
      case 'controlledSteps':
        return runningStatus === 'failed' ? (
          <Tooltip
            title={$i18n.get({
              id: 'advance.components.AnalysisHistory.TemplateDrawer.TheCurrentNodeFailedTo',
              dm: '当前节点执行失败，点从头重新执行',
            })}
          >
            <Button type="primary" onClick={() => resetStep()} style={style}>
              <RedoOutlined color="#fff" />
            </Button>
          </Tooltip>
        ) : (
          <Button type="primary" onClick={() => handleApplyStep()} style={style} disabled={runningStatus === 'running'}>
            <CaretRightOutlined color="#fff" />
          </Button>
        );

      case 'autoSteps':
      default:
        if (runningStatus === 'failed') {
          return (
            <Tooltip
              title={$i18n.get({
                id: 'advance.components.AnalysisHistory.TemplateDrawer.TheCurrentNodeFailedTo',
                dm: '当前节点执行失败，点从头重新执行',
              })}
            >
              <Button
                type="primary"
                onClick={() => {
                  resetStep();
                  handleApplyAuto(1000);
                }}
                style={style}
              >
                <RedoOutlined color="#fff" />
              </Button>
            </Tooltip>
          );
        }
        if (runningStatus === 'running' || runningStatus === 'success') {
          return (
            <Button
              type="primary"
              onClick={() => {
                stepTimer && clearTimeout(stepTimer);
                resetStep();
              }}
              style={style}
            >
              <PauseOutlined color="#fff" />
            </Button>
          );
        }
        return (
          <Button type="primary" onClick={() => handleApplyAuto(1000)} style={style}>
            <CaretRightOutlined color="#fff" />
          </Button>
        );
    }
  }, [currentStep, applyWay, runningStatus]);

  return (
    <Drawer
      title={$i18n.get({
        id: 'advance.components.AnalysisHistory.TemplateDrawer.AnalysisLinkTemplate',
        dm: '分析链路模版',
      })}
      width="50vw"
      maskClosable={false}
      mask={false}
      open={open}
      onClose={handleClose}
    >
      <Form>
        <Form.Item
          label={$i18n.get({ id: 'advance.components.AnalysisHistory.TemplateDrawer.SelectTemplate', dm: '选择模版' })}
          name="template"
          className="gi-history-drawer-select"
        >
          <Select defaultValue={state.activeTemplateId} style={{ width: '100%' }} onChange={handleTemplateChange}>
            {templates?.map(template => (
              <Select.Option value={template.id}>
                {template.name}
                {template.description ? (
                  <span style={{ color: 'var(--text-color-secondary)', marginLeft: '4px' }}>
                    {`(${template.description})`}
                  </span>
                ) : (
                  ''
                )}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div style={{ width: '100%', display: 'inline-flex' }}>
          <Form.Item
            label={$i18n.get({
              id: 'advance.components.AnalysisHistory.TemplateDrawer.ExecutionMethod',
              dm: '执行方式',
            })}
            name="applyWay"
            initialValue={'autoSteps'}
            style={{ width: 'calc(100% - 83px)' }}
            className="gi-history-drawer-select gi-history-drawer-select-apply"
          >
            <Select
              style={{ width: '100%' }}
              onChange={value => {
                resetStep(runningStatus === 'finish');
                updateState(draft => {
                  draft.applyWay = value as ApplyWay;
                });
              }}
              options={[
                {
                  value: 'autoSteps',
                  label: $i18n.get({
                    id: 'advance.components.AnalysisHistory.TemplateDrawer.AutomaticStepByStepExecution',
                    dm: '自动分步执行',
                  }),
                },
                {
                  value: 'controlledSteps',
                  label: $i18n.get({
                    id: 'advance.components.AnalysisHistory.TemplateDrawer.ManualStepByStepExecution',
                    dm: '手动分步执行',
                  }),
                },
              ]}
            />
          </Form.Item>
          <Tooltip
            title={$i18n.get({
              id: 'advance.components.AnalysisHistory.TemplateDrawer.DoNotConfigureUseDefault',
              dm: '可不配置，使用默认参数执行',
            })}
            placement="bottomLeft"
            open={state.applyBtnTooltipVisible}
          >
            <div style={{ width: '83px' }}>{applyButton}</div>
          </Tooltip>
        </div>
      </Form>
      <div className="gi-history-drawer-graph-wrapper">
        <FlowGraph
          urlMap={urlMap}
          style={{ width: '50%' }}
          graphData={templates?.find(template => template.id === state.activeTemplateId)}
          isConfigure={true}
          runningId={runningId}
          errorInfos={errorInfos}
          successIds={successIds}
          configuring={configuring}
          setConfiguring={conf =>
            updateState(draft => {
              draft.configuring = conf;
            })
          }
        />

        <ConfigurePanel
          configuring={state.configuring}
          updateConfigure={(nodeId, values) => handleUpdateConfigure(state.activeTemplateId, nodeId, values)}
        />
      </div>
    </Drawer>
  );
};

export default TemplateDrawer;
