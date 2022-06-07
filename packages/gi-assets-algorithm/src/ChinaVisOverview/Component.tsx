import { useContext } from "@alipay/graphinsight";
import { Column, Pie, Sunburst, BidirectionalBar, Scatter } from "@antv/g2plot";
import csvjson from 'csvjson';
import { Row, Col, Form, Select, Input, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import nodeTypeData from './data/nodeType.json';
import domainIndustryData from './data/nodeDomainType.json';
import edgeTypeData from './data/edgeType.json';
import { debounce } from '@antv/util';
import "./index.less";

const { Option } = Select;

const industries = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const industryMap = {
  "A": "涉黄",
  "B": "涉赌",
  "C": "诈骗",
  "D": "涉毒",
  "E": "涉枪",
  "F": "黑客",
  "G": "非法交易平台",
  "H": "非法支付平台",
  "I": "其他"
}

const sthDomainPathMap = {
  // name 相关域名及域名类型数量：
  'Whois_Name': 'https://gw.alipayobjects.com/os/bmw-prod/04a48d23-9052-4711-a0bc-ebe78d20ecbf.csv',
  // cert 相关域名及域名类型数量：
  'Cert': 'https://gw.alipayobjects.com/os/bmw-prod/fbd7be82-548c-4e6a-b32a-adcde0ae294e.csv',
  // ip 相关域名及域名类型数量：
  'IP': 'https://gw.alipayobjects.com/os/bmw-prod/5dc92ab3-fdb1-49fe-871b-7c42ec38ad13.csv'
}
const domainDegreePath = "https://gw.alipayobjects.com/os/bmw-prod/f12f576a-d91d-4362-b78e-dee67ae5988f.csv"
const domainPrPath = {
  '100': 'https://gw.alipayobjects.com/os/bmw-prod/ce5e31f6-4f01-4653-874e-074224e32359.csv',
  '500': 'https://gw.alipayobjects.com/os/bmw-prod/178a6251-1581-4789-870a-bbf088df2bb0.csv',
  '1000': 'https://gw.alipayobjects.com/os/bmw-prod/5995679e-ae2c-4f49-9c18-a2737ab48e07.csv'
}
const domianImportancePathMap = {
  pageRank: domainPrPath['100'],
  degreeCentrality: '',
  closenessCentrality: '',
  betweenessCentrality: '',
}

export interface OverviewProps {
  style?: React.CSSProperties;
}
let edgeTypeSunburst, sthDomainStackedColumnPlot, degreeStackedColumnPlot, importancePlot;

const NodesClustering: React.FunctionComponent<OverviewProps> = (
  props
) => {
  const context = useContext();
  const { graph, layout, updateContext } = context;

  const [sthDomainProp, setSthDomainProp] = useState({
    sth: 'Whois_Name',
    begin: 0,
    end: 100
  });
  const [degreeProp, setDegreeProp] = useState({
    begin: 0,
    end: 100
  })
  const [importanceFields, setImportanceFields] = useState(['pageRank', 'degreeCentrality'] as string[]);

  const nodeTypePieRef: React.MutableRefObject<null> = useRef(null);
  const domainIndustryPieRef: React.MutableRefObject<null> = useRef(null);
  const edgeTypeSunburstRef: React.MutableRefObject<null> = useRef(null);
  const sthDomainStackedRef: React.MutableRefObject<null> = useRef(null);
  const degreeStackedRef: React.MutableRefObject<null> = useRef(null);
  const importancePlotRef: React.MutableRefObject<null> = useRef(null);

  const [form] = Form.useForm();
  const { validateFields, resetFields } = form;

  const renderPie = (chartData, container) => {
    const nodeTypePie = new Pie(container, {
      appendPadding: 10,
      data: chartData,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,	
      innerRadius: 0.54,
      meta: {
        value: {
          formatter: (v) => `${v}`,
        },
        type: {
          formatter: v => {
            const zh = industryMap[v];
            return zh ? `${v} ${zh}` : v
          }
        }
      },
      label: {
        type: 'innder',
        offset: '-50%',
        autoRotate: false,
        style: { textAlign: 'center' },
        layout: [{ type: 'hide-overlap' }],
        formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      },
      statistic: {
        // @ts-ignore
        top: true,
        title: {
          offsetY: -8,
          style: {	
            width: '400px'	
          },
          customHtml: (container, view, datum, filteredData) => {	
            // @ts-ignore
            const sum = filteredData.reduce((s, d) => s + d.value, 0);	
            if (!datum) return `总计`	
            return `<div>	
            <div>${industryMap[datum.type] ? datum.type + ' ' + industryMap[datum.type] : datum.type}</div>	
            </div>`	
          }
        },
        content: {
          offsetY: -4,
          style: {	
            width: '400px'	
          },	
          customHtml: (container, view, datum, filteredData) => {	
            // @ts-ignore
            const sum = filteredData.reduce((s, d) => s + d.value, 0);	
            if (!datum) return `${sum}`	
            return `<div>	
            <div>${datum.value}</div>	
              <div style="font-size:14px;font-weight:400;">${(datum.value / sum * 100).toFixed(2)}%</div>	
            </div>`	
          }
        },
      },
      // 添加 中心统计文本 交互
      interactions: [
        { type: 'element-selected' },
        { type: 'element-active' },
        {
          type: 'pie-statistic-active',
          cfg: {
            start: [
              { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
              { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
            ],
            end: [
              { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
              { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
            ],
          },
        },
      ],
    });
    nodeTypePie.render();
  }

  const renderEdgeTypeSunburst = () => {
    // @ts-ignore
    edgeTypeSunburst = new Sunburst(edgeTypeSunburstRef.current, {
      data: edgeTypeData,
      innerRadius: 0.3,
      interactions: [{ type: 'element-active' }],
      label: {
        // label layout: limit label in shape, which means the labels out of shape will be hide
        layout: [{ type: 'limit-in-shape' }],
      },
      meta: {
        [Sunburst.SUNBURST_ANCESTOR_FIELD]: {
          // 可以对 series 维度值排序
          values: ["4", "3", "2", "1", "0"]
        },
      },
      legend: {
        title: '强度值',
        itemName: { 
          formatter: txt =>{ console.log('text', txt);  return `强度 ${txt}`}
        }
      },
      color: ['#f5222d', '#fa8c16', '#ffd666', '#bae637', '#ccc'],
    });
    edgeTypeSunburst.render();
  }

  const renderSthDomainStacked = () => {
    const { sth, begin, end } = sthDomainProp;
    fetch(sthDomainPathMap[sth])
    .then((data) => data.text())
    .then((data) => {
      const json = csvjson.toObject(data, {
        delimiter: ",",
        quote: '"',
        arrayDenote: ""
      });
      const chartData: any[] = [];
      for (let i = begin; i < end; i++) {
        const item = json[i];
        industries.forEach(ind => {
          chartData.push({
            id: item.id,
            name: `${item.id}|SPLITOR|${item.name}`,
            type: ind,
            value: (+item[ind])
          })
        })
      }
      if (sthDomainStackedColumnPlot && !sthDomainStackedColumnPlot.destroyed) {
        sthDomainStackedColumnPlot.changeData(chartData);
        return;
      }
      // @ts-ignore
      sthDomainStackedColumnPlot = new Column(sthDomainStackedRef.current, {
        data: chartData,
        isStack: true,
        xField: "name",
        yField: "value",
        seriesField: "type",
        appendPadding: 4,
        label: false,
        interactions: [
          { type: "active-region", enable: false },
          { type: "element-active", enable: false }
        ],
        connectedArea: {
          style: (oldStyle, element) => {
            return {
              fill: "rgba(0,0,0,0.25)",
              stroke: oldStyle.fill,
              lineWidth: 0.5
            };
          }
        },
        meta: {
          name: {
            formatter: (text) =>
              text.split("|SPLITOR|")[1] || text.split("|SPLITOR|")[0]
          },
          type: {
            // 可以对 series 维度值排序
            values: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
            formatter: v => {
              const zh = industryMap[v];
              return zh ? `${v} ${industryMap[v]}` : v
            }
          }
        },
        scrollbar: {
          categorySize: 5
        }
      });

      sthDomainStackedColumnPlot.render();
      sthDomainStackedColumnPlot.on('element:click', (...args) => {
        const { data } = args?.[0] as any;
        if (data?.shape === 'rect' && data?.data?.id) {
          clickCopy(data?.data?.id);
        }
      });
    });
  }

  const renderDegreeStacked = () => {
    fetch(domainDegreePath)
      .then((data) => data.text())
      .then((data) => {
        const json = csvjson.toObject(data, {
          delimiter: ",",
          quote: '"',
          arrayDenote: ""
        });
        console.log('fetch data bakc', json[0])
        const { begin, end } = degreeProp;
        const chartData: any = [];
        for (let i = begin; i < end; i++) {
          const item = json[i];
          chartData.push({
            id: item.id,
            name: `${item.id}|SPLITOR|${item.name}`,
            inDegree: +item.inDegree,
            outDegree: +item.outDegree
            // type: "inDegree",
            // value: +item.inDegree
          });
          // chartData.push({
          //   id: item.id,
          //   name: `${item.id}|SPLITOR|${item.name}`,
          //   type: "outDegree",
          //   value: +item.outDegree
          // });
        }
        if (degreeStackedColumnPlot && !degreeStackedColumnPlot.destroyed) {
          degreeStackedColumnPlot.changeData(chartData);
          return;
        }
        // @ts-ignore
        degreeStackedColumnPlot = new BidirectionalBar(degreeStackedRef.current, {
          data: chartData,
          layout: 'vertical',
          xField: "name",
          yField: ['inDegree', 'outDegree'],
          label: false,
          appendPadding: [0, 0, 0, 8],
          // interactions: [{ type: "active-region", enable: false }],
          // connectedArea: {
          //   style: (oldStyle, element) => {
          //     return {
          //       fill: "rgba(0,0,0,0.25)",
          //       stroke: oldStyle.fill,
          //       lineWidth: 0.5
          //     };
          //   }
          // },
          meta: {
            name: {
              formatter: (text) =>
                text.split("|SPLITOR|")[1] || text.split("|SPLITOR|")[0]
            }
          }
        });

        degreeStackedColumnPlot.render();
        degreeStackedColumnPlot.on('element:click', (...args) => {
          console.log('click', args);
          const { data } = args?.[0] as any;
          if (data?.shape === 'rect' && data?.data?.id) {
            clickCopy(data?.data?.id);
          }
        });
      });
  }

  const renderOneFieldImportanceColumn = () => {
    const field = importanceFields[0];
    // TODO: 暂时只有 pageRank
    const path = domainPrPath['100'] // domianImportancePathMap[field];
    fetch(path)
    .then((csv) => csv.text())
    .then((csv) => {
      const data = csvjson.toObject(csv, {
        delimiter: ",",
        quote: '"',
        arrayDenote: ""
      });
      data.forEach(item => {
        item.value = (+item.value);
        item.name = `${item.id}|SPLITOR|${item.name}`;
      })
      // @ts-ignore
      importancePlot = new Column(importancePlotRef.current, {
        data,
        xField: "name",
        yField: "value",
        appendPadding: 4,
        label: false,
        interactions: [
          { type: "element-active", enable: false }
        ],
        meta: {
          name: {
            formatter: (text) =>
              text.split("|SPLITOR|")[1] || text.split("|SPLITOR|")[0]
          },
        },
        scrollbar: {
          categorySize: 5
        }
      });
      importancePlot.render();
      importancePlot.on('element:click', (...args) => {
        const { data } = args?.[0] as any;
        if (data?.shape === 'rect' && data?.data?.id) {
          clickCopy(data?.data?.id);
        }
      });
    });
  
  }
  const renderTwoFiledsImportanceScatter = () => {
    const field = importanceFields;
    const prPath = domainPrPath['1000'] // domianImportancePathMap[field];
    fetch(prPath)
    .then((prCsv) => prCsv.text())
    .then((prCsv) => {
      const prData = csvjson.toObject(prCsv, {
        delimiter: ",",
        quote: '"',
        arrayDenote: ""
      });
      // TODO: 替换真实数据，需要取两个文件的 top N 交集，形成下面格式的 JSON
      fetch('https://gw.alipayobjects.com/os/bmw-prod/f12f576a-d91d-4362-b78e-dee67ae5988f.csv')
      .then((degreeCsv) => degreeCsv.text())
      .then((degreeCsv) => {
        const degreeData = csvjson.toObject(degreeCsv, {
          delimiter: ",",
          quote: '"',
          arrayDenote: ""
        });
        const degreeMap = {};
        degreeData.forEach(degree => {
          degreeMap[degree.id] = degree;
        })
        const scatterData: any[] = [];
        prData.forEach(pr => {
          scatterData.push({
            id: pr.id,
            name: pr.name,
            pagerank: (+pr.value) || 0,
            degree: ((+degreeMap[pr.id]?.degree) || 0) + Math.random()
          })
        });
        console.log('scatterData', scatterData.length, scatterData[0], degreeData.length, prData.length);
        // @ts-ignore
        importancePlot = new Scatter(importancePlotRef.current, {
          appendPadding: 10,
          data: scatterData,
          xField: 'degree',
          yField: 'pagerank',
          shape: 'circle',
          // colorField: 'Genre',
          size: 4,
          yAxis: {
            nice: true,
            line: {
              style: {
                stroke: '#aaa',
              },
            },
          },
          xAxis: {
            min: 0,
            grid: {
              line: {
                style: {
                  stroke: '#eee',
                },
              },
            },
            line: {
              style: {
                stroke: '#aaa',
              },
            },
          },
        });
        importancePlot.render();
        importancePlot.on('element:click', (...args) => {
          console.log('click', args);
          const { data } = args?.[0] as any;
          if (data?.shape === 'circle' && data?.data?.id) {
            clickCopy(data?.data?.id);
          }
        });
      });
    });
  }

  const onImportanceFieldsSelect = d => {
    if (importanceFields.length < 2) setImportanceFields(old => [...old, d]);
    else setImportanceFields(old => {
      const fields = [...old];
      fields[1] = d;
      return fields;
    })
  }

  const onImportanceFieldsDeselect = d => {
    setImportanceFields(old => {
      const fields = [...old];
      const idx = fields.indexOf(d);
      fields.splice(idx, 1);
      return fields;
    })
  }

  const onSthDomainPropChange = debounce(() => {
    validateFields().then(values => {
      setSthDomainProp(old => ({
        ...old,
        begin: values['sth-domain-begin'],
        end: values['sth-domain-end']
      }))

    })
  }, 500);

  const onDegreePropChange = debounce(() => {
    validateFields().then(values => {
      setDegreeProp(old => ({
        ...old,
        begin: values['degree-begin'],
        end: values['degree-end']
      }))

    })
  }, 500)


  const clickCopy = (value: string, info?: string) => {
    if (document.execCommand('copy')) {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value', value);
      input.select();
      document.execCommand('copy');
      message.success(info || '节点 id 已复制到剪贴板中');
      document.body.removeChild(input);
    } else {
      message.info('复制失败');
    }
  };

  useEffect(() => {
    renderPie(nodeTypeData, nodeTypePieRef.current);
    renderPie(domainIndustryData, domainIndustryPieRef.current);
    renderEdgeTypeSunburst();
  }, []);
  
  useEffect(() => {
    renderSthDomainStacked();
  }, [sthDomainProp]);

  useEffect(() => {
    renderDegreeStacked();
  }, [degreeProp]);

  useEffect(() => {
    console.log('importanceFields', importanceFields, domainPrPath['100']);
    if (importancePlot) importancePlot.destroy();
    if (!importanceFields?.length) {
      return;
    }
    if (importanceFields.length === 1) {
      // 一个指标，绘制直方图
      renderOneFieldImportanceColumn();
    } else {
      // 两个指标，绘制散点图
      renderTwoFiledsImportanceScatter();

    }

  }, [importanceFields])

  return (
    <div
      style={{
        background: "#fff",
      }}
    >
      <Form
        form={form}
        initialValues={{
          'degree-begin': degreeProp.begin,
          'degree-end': degreeProp.end,
          'sth-domain-begin': sthDomainProp.begin,
          'sth-domain-end': sthDomainProp.end
        }}
      >
        <div className="data-overview-wrapper">
          <div className="types-overview block-wrapper">
            <h3>实体类型与关系类型</h3>
            <Row>
              <Col span={8}>
                <h4 className="chart-title">实体类型占比</h4>
                <div className="chart-container" style={{ height: '300px' }} ref={nodeTypePieRef} />
              </Col>
              <Col span={8}>
                <h4 className="chart-title">Domain 类型占比</h4>
                <div className="chart-container" style={{ height: '300px' }} ref={domainIndustryPieRef} />
              </Col>
              <Col span={8}>
                <h4 className="chart-title">关系类型及其强度占比</h4>
                <div className="chart-container" style={{ height: '300px' }}  ref={edgeTypeSunburstRef} />
              </Col>
            </Row>
          </div>
          <div className="degree block-wrapper">
            <h3>Domain 与 r_request_jump 度数</h3>
              <Input.Group compact size={'small'}>
                <p style={{ lineHeight: '32px', marginRight: '4px' }}>index 范围: </p>
                <Form.Item
                  rules={[{ validator: (_, value) => {
                    const valueNum = (+value);
                    return !isNaN(valueNum) && valueNum >= 0 ? Promise.resolve() : Promise.reject(new Error('输入 >=0 数字'))
                  } }]}
                  name={`degree-begin`}
                  key={`degree-begin`}
                >
                  <Input
                    style={{ width: 100, textAlign: 'center' }}
                    placeholder="Minimum"
                    defaultValue={degreeProp.begin}
                    onChange={() => onDegreePropChange()}
                  />
                </Form.Item>
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                    marginTop: '4px'
                  }}
                  placeholder="~"
                  disabled
                />
                <Form.Item
                  rules={[{ validator: (_, value) => {
                    const valueNum = (+value);
                    return !isNaN(valueNum) && valueNum >= 0 ? Promise.resolve() : Promise.reject(new Error('输入 >0 数字'))
                  } }]}
                  name={`degree-end`}
                  key={`degree-end`}
                >
                  <Input
                    className="site-input-right"
                    style={{
                      width: 100,
                      textAlign: 'center',
                    }}
                    placeholder="Maximum"
                    defaultValue={degreeProp.end}
                    onChange={() => onDegreePropChange()}
                  />
                </Form.Item>
              </Input.Group>
            <div className="chart-container" style={{ height: '150px', width: '100%' }} ref={degreeStackedRef} />
          </div>
          <div className="sth-domain block-wrapper">
            <h3>注册人/IP/证书 V.S Domain 数量/Domain 种类</h3>
            <Row>
              <Col span={4}>
                <Select
                  className="sth-domain-select"
                  size="small"
                  defaultValue={sthDomainProp.sth}
                  options={Object.keys(sthDomainPathMap).map(key => ({ label: key, value: key }))}
                  dropdownMatchSelectWidth={false}
                  style={{
                    width: '150px'
                  }}
                  onChange={key => setSthDomainProp(old => ({
                    ...old,
                    sth: key
                  }))}
                />
              </Col>
              <Col span={12} offset={2}>
                  <Input.Group compact size={'small'}>
                    <p style={{ lineHeight: '32px', marginRight: '4px' }}>index 范围: </p>
                    <Form.Item
                      rules={[{ validator: (_, value) => {
                        const valueNum = (+value);
                        return !isNaN(valueNum) && valueNum >= 0 ? Promise.resolve() : Promise.reject(new Error('输入 >0 数字'))
                      } }]}
                      name={`sth-domain-begin`}
                      key={`sth-domain-begin`}
                    >
                      <Input
                        style={{ width: 100, textAlign: 'center' }}
                        placeholder="Minimum"
                        defaultValue={sthDomainProp.begin}
                        onChange={() => onSthDomainPropChange()}
                      />
                    </Form.Item>
                    <Input
                      className="site-input-split"
                      style={{
                        width: 30,
                        borderLeft: 0,
                        borderRight: 0,
                        pointerEvents: 'none',
                        marginTop: '4px'
                      }}
                      placeholder="~"
                      disabled
                    />
                    <Form.Item
                      rules={[{ validator: (_, value) => {
                        const valueNum = (+value);
                        return !isNaN(valueNum) && valueNum >= 0 ? Promise.resolve() : Promise.reject(new Error('输入 >0 数字'))
                      } }]}
                      name={`sth-domain-end`}
                      key={`sth-domain-end`}
                    >
                      <Input
                        className="site-input-right"
                        style={{
                          width: 100,
                          textAlign: 'center',
                        }}
                        placeholder="Maximum"
                        defaultValue={sthDomainProp.end}
                        onChange={() => onSthDomainPropChange()}
                      />
                    </Form.Item>
                  </Input.Group>
              </Col>
            </Row>
            <div className="chart-container" style={{ height: '300px', width: '100%' }} ref={sthDomainStackedRef} />
          </div>
          <div className="importance block-wrapper">
            <h3>Domain 节点重要性</h3>
            <div
              className="importance-field-select-wrapper"
              style={{
                display: 'inline-flex'
              }}
            >
              <p>选择 1-2 个重要性: </p>
              <Select
                className="importance-property-select"
                size="small"
                options={[
                  { label: 'PageRank', value: 'pageRank' },
                  { label: 'Degree Centrality', value: 'degreeCentrality' },
                  { label: 'Closeness Centrality', value: 'closenessCentrality' },
                  { label: 'Betweeness Centrality', value: 'betweenessCentrality' },
                ]}
                dropdownMatchSelectWidth={false}
                style={{
                  width: '400px',
                  marginLeft: '4px'
                }}
                mode={'multiple'}
                value={importanceFields}
                onSelect={onImportanceFieldsSelect}
                onDeselect={onImportanceFieldsDeselect}
              />
            </div>
            <div className="chart-container" style={{ height: '300px', width: '100%' }} ref={importancePlotRef}>
              {!importanceFields?.length && <div
                style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}
              >
                <p className="importance-empty-tip">请先选择 1-2 个重要性指标</p>
              </div>}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default NodesClustering;
