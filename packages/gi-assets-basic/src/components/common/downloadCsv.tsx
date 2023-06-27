import { Parser } from 'json2csv';
import $i18n from '../../i18n';
const downloadCsv = (data, name = $i18n.get({ id: 'basic.components.common.downloadCsv.Unnamed', dm: '未命名' })) => {
  // 数量过多，结果下载成 csv 文件
  const json2csvParser = new Parser({ delimiter: ',', withBOM: true });
  const csvStr = json2csvParser.parse(data);
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURI(`${csvStr}`);
  a.download = `${name}.csv`;
  a.click();
};

export default downloadCsv;
