import { DeleteOutlined, DownOutlined, SettingFilled, UpOutlined } from '@ant-design/icons';
import { useContext, utils } from '@antv/gi-sdk';
import { Button, Col, Popover, Row, Tooltip, message } from 'antd';
import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
import $i18n from '../../i18n';
import { getStyles } from '../Sheetbar/utils';
import TemplateDrawer from './TemplateDrawer';
import TemplateModal from './TemplateModal';
import './index.less';
import { TemplateData } from './type';
import { ellipsisString, getRecordContent, getRecordsFromHistory } from './util';

export interface AnalysisHistoryProps {
  height: number;
  placement: 'top' | 'bottom';
  saveTemplateServiceId?: string;
  listTemplateServiceId?: string;
  removeTemplateServiceId?: string;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = props => {
  const { GISDK_ID, history, graph, services } = useContext();
  const {
    height,
    placement,
    saveTemplateServiceId = 'GI/SaveHistoryTemplateService',
    listTemplateServiceId = 'GI/ListHistoryTemplateService',
    removeTemplateServiceId = 'GI/RemoveHistoryTemplateService',
  } = props;

  const [state, updateState] = useImmer({
    // 页面底部的历史记录栏是否收起
    collapsed: true,
    // 每一步历史记录产生的 screenshot 的图片地址，key 为历史记录 id，value 为图片的 base64
    urlMap: {},
    // 沉淀分析历史的 modal 是否打开
    modalOpened: false,
    // 从服务端获取的已保存的模版列表
    templates: [] as TemplateData[],
    // 模版应用的抽屉是否打开
    templateDrawerVisible: false,
    // 模版应用的提示是否显示
    templateApplyTooltipVisible: false,
  });

  const listService = utils.getService(services, listTemplateServiceId);
  const saveService = utils.getService(services, saveTemplateServiceId);
  const removeService = utils.getService(services, removeTemplateServiceId);

  const { collapsed, urlMap, modalOpened, templates, templateDrawerVisible, templateApplyTooltipVisible } = state;

  const GISDK_DOM = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;

  /**
   * 挂载组件时，获取已保存的模版列表
   * 若存在模版，则显示提示用户使用的 tooltip
   */
  React.useEffect(() => {
    fetchTemplates(data => {
      if (data.length) {
        setTimeout(() => {
          toggleTemplateApplyTooltipVisible(true);
          setTimeout(() => {
            toggleTemplateApplyTooltipVisible(false);
          }, 5000);
        }, 500);
      }
    });
  }, []);

  /**
   * 历史记录变更时，生成当前画布的截图作为 screenshot
   */
  React.useEffect(() => {
    const newHistory = history?.[history.length - 1];
    const imgURL = graph.toDataURL('image/jpeg', '#fff');
    if (newHistory) {
      const { id, success } = newHistory;
      if (!success) return;
      updateState(draft => {
        draft.urlMap[id] = imgURL;
      });
    }
  }, [history]);

  /**
   * 从服务端获取模版列表
   * @param callback 获取成功后的回调函数
   */
  const fetchTemplates = (callback?: Function) => {
    if (!listService) {
      message.error(
        $i18n.get({
          id: 'advance.components.AnalysisHistory.Component.FailedToObtainTheTemplate',
          dm: '获取模版列表失败，无获取模版的服务',
        }),
      );
      return;
    }
    (async () => {
      const templateList = await listService();
      const { success, data } = templateList;
      if (success) {
        updateState(draft => {
          draft.templates = data;
        });
        callback?.(data);
      } else {
        updateState(draft => {
          draft.templates = [];
        });
        message.error(
          $i18n.get({
            id: 'advance.components.AnalysisHistory.Component.FailedToObtainTheAnalysis',
            dm: '分析历史模版列表获取失败',
          }),
        );
      }
    })();
  };

  /**
   * 保存一个模版，保存成功后重新获取模版列表
   * @param data 保存的模版数据，包括图数据以及一些额外的描述信息
   * @param name 模版名称
   * @param description 模版辅助描述
   */
  const handleSaveTemplate = async (data: TemplateData, name: string, description?: string) => {
    if (!saveService) {
      message.error(
        $i18n.get({
          id: 'advance.components.AnalysisHistory.Component.SaveFailedThereIsNo',
          dm: '保存失败，无保存模版的服务',
        }),
      );
      return;
    }
    const reuslt = await saveService({ ...data, name, description });
    if (reuslt.success) {
      message.success(
        $i18n.get(
          {
            id: 'advance.components.AnalysisHistory.Component.TheHistoricalAnalysisLinkTemplate',
            dm: '历史分析链路模版 {name}({description}) 保存成功，您将可以右下方「使用分析模版」中使用',
          },
          { name: name, description: description },
        ),
      );
      fetchTemplates();
    } else {
      message.error($i18n.get({ id: 'advance.components.AnalysisHistory.Component.SaveFailed', dm: '保存失败' }));
    }
  };

  /**
   * 移除一个模版，移除成功后重新获取模版列表
   * @param templateId 需要删除的模版 id
   * @param name 模版名称
   * @param description 模版辅助描述
   */
  const handleRemoveTemplate = async (templateId: string, name: string, description?: string) => {
    if (!removeService) {
      message.error(
        $i18n.get({
          id: 'advance.components.AnalysisHistory.Component.FailedToRemoveNoService',
          dm: '移除失败，无移除模版的服务',
        }),
      );
      return;
    }
    const reuslt = await removeService({ ids: [templateId] });
    if (reuslt?.success) {
      const title = description ? `${name}(${description})` : name;
      message.success(
        $i18n.get(
          {
            id: 'advance.components.AnalysisHistory.Component.HistoricalAnalysisLinkTemplateTitle',
            dm: '历史分析链路模版 {title} 删除成功',
          },
          { title: title },
        ),
      );
      fetchTemplates();
    } else {
      message.error($i18n.get({ id: 'advance.components.AnalysisHistory.Component.FailedToDelete', dm: '删除失败' }));
    }
  };

  /**
   * 点击“使用分析模版”的响应函数，显示模版应用配置抽屉
   */
  const handleUseTemplate = () => {
    toggleTemplateApplyTooltipVisible(false);
    updateState(draft => {
      draft.templateDrawerVisible = true;
    });
  };

  /**
   * 更新某模版中某一节点的配置
   * @param templateId 模版 id
   * @param nodeId 节点 id
   * @param values 配置表单值
   */
  const handleUpdateConfigure = (templateId, nodeId, values) => {
    if (!templateId || !nodeId) return;
    updateState(draft => {
      draft.templates.forEach(template => {
        if (template.id !== templateId) return;
        template.nodes.forEach(node => {
          if (node.id !== nodeId) return;
          node.configured = values;
        });
      });
    });
  };

  /**
   * 控制模版应用提示的可见性
   * @param visible
   */
  const toggleTemplateApplyTooltipVisible = visible => {
    updateState(draft => {
      draft.templateApplyTooltipVisible = visible;
    });
  };

  /**
   * Popover 管理（删除）已有模版
   */
  const configBtn = (
    <Popover
      title={$i18n.get({
        id: 'advance.components.AnalysisHistory.Component.ManageExistingTemplates',
        dm: '管理已有模版',
      })}
      trigger="click"
      placement="topRight"
      content={
        <div style={{ width: '200px' }}>
          {templates?.map(template => {
            const { id, name, description } = template;
            return (
              <Row justify="space-between">
                <Col>{ellipsisString(description ? `${name}(${description})` : name, 30)}</Col>
                <Col>
                  <Tooltip
                    title={$i18n.get({ id: 'advance.components.AnalysisHistory.Component.Delete', dm: '删除' })}
                    placement="right"
                  >
                    <DeleteOutlined onClick={() => handleRemoveTemplate(id, name, description)} />
                  </Tooltip>
                </Col>
              </Row>
            );
          })}
        </div>
      }
    >
      <SettingFilled style={{ color: 'var(--text-color)' }} />
    </Popover>
  );

  const styles = getStyles(height, placement);
  const style = collapsed
    ? styles.sheetbar
    : {
        ...styles.sheetbar,
        height: '300px',
      };

  const lastHistory = history?.[history.length - 1];
  const HistoryFooterComponent = (
    <div style={{ ...style, display: 'unset' }} className="gi-history-footer">
      <Row justify="space-between" style={{ width: '100%' }}>
        <Col style={{ display: 'inline-flex' }} span={16}>
          {collapsed ? (
            <>
              <UpOutlined
                onClick={() => {
                  updateState(draft => {
                    draft.collapsed = false;
                  });
                }}
                style={{ marginRight: '8px', marginTop: '12px' }}
              />

              {lastHistory ? (
                getRecordContent(lastHistory, urlMap[lastHistory.id])
              ) : (
                <span>
                  {$i18n.get({ id: 'advance.components.AnalysisHistory.Component.NoRecord', dm: '暂无记录' })}
                </span>
              )}
            </>
          ) : (
            <>
              <DownOutlined
                style={{ marginTop: '14px' }}
                onClick={() => {
                  updateState(draft => {
                    draft.collapsed = true;
                  });
                }}
              />

              <span style={{ marginLeft: '4px' }}>
                {$i18n.get({ id: 'advance.components.AnalysisHistory.Component.HistoryList', dm: '历史记录列表' })}
              </span>
            </>
          )}
        </Col>
        <Col span={7} offset={1} style={{ textAlign: 'right' }}>
          <Tooltip
            title={$i18n.get({
              id: 'advance.components.AnalysisHistory.Component.TheAnalysisTemplateIsDetected',
              dm: '⭐️检测到该项目存在分析模版，点击此处使用',
            })}
            open={collapsed && templateApplyTooltipVisible}
          >
            <a
              onClick={handleUseTemplate}
              onMouseLeave={() => toggleTemplateApplyTooltipVisible(false)}
              style={{ display: templates?.length ? 'inline-flex' : 'none' }}
            >
              {$i18n.get({
                id: 'advance.components.AnalysisHistory.Component.UseAnalysisTemplates',
                dm: '使用分析模版',
              })}
            </a>
          </Tooltip>
          <Tooltip
            title={
              !history?.length
                ? $i18n.get({
                    id: 'advance.components.AnalysisHistory.Component.NoHistoryPleaseAnalyzeThe',
                    dm: '暂无历史，请先分析数据',
                  })
                : ''
            }
          >
            <Button
              type="text"
              onClick={() => {
                updateState(draft => {
                  draft.modalOpened = true;
                });
              }}
              disabled={!history?.length}
              style={{
                marginRight: '0 6px',
                color: !history?.length ? 'var(--text-color-secondary)' : 'var(--primary-color)',
              }}
            >
              {$i18n.get({
                id: 'advance.components.AnalysisHistory.Component.PrecipitationAnalysisHistory',
                dm: '沉淀分析历史',
              })}
            </Button>
          </Tooltip>
          {configBtn}
        </Col>
      </Row>
      {!collapsed ? (
        <div className="gi-history-footer-item-container">{getRecordsFromHistory(history, urlMap)}</div>
      ) : (
        ''
      )}

      <TemplateModal
        templates={templates}
        open={modalOpened}
        urlMap={urlMap}
        handleSave={handleSaveTemplate}
        handleClose={() => {
          updateState(draft => {
            draft.modalOpened = false;
          });
        }}
      />

      <TemplateDrawer
        open={templateDrawerVisible}
        templates={templates}
        urlMap={urlMap}
        handleClose={() =>
          updateState(draft => {
            draft.templateDrawerVisible = false;
          })
        }
        handleUpdateConfigure={handleUpdateConfigure}
      />
    </div>
  );

  return ReactDOM.createPortal(HistoryFooterComponent, GISDK_DOM);
};

export default memo(AnalysisHistory);
