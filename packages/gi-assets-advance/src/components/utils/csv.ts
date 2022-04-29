
// 格式化表格标题
export const formatFileName = name => {
    let formattedName = '导出数据.csv';
    if (name) {
      if (name.indexOf('.csv') > 0) {
        formattedName = name;
      } else {
        formattedName = name + '.csv';
      }
    }
    return formattedName;
};
  
  // 格式化导出数据
export const transformCSVData = (originData, columns) => {
    const title: string[] = [];
    const titleForKey: string[] = [];
    let exportData = {};
    if (columns && columns.length > 0) {
      columns.forEach(column => {
        titleForKey.push(column.dataIndex);
        title.push(column.title);
      });
    }
    if (originData && originData.length > 0) {
      exportData = {
        data: originData,
        title,
        titleForKey,
      };
    }
    return exportData;
};
  
// 导出csv数据
export const exportCSV = (config, fileName) => {
    // showPureNumber 判断是否导出纯数字  目的：兼容不希望以科学计数展示的数字
    const { data, titleForKey, title, showPureNumber = false } = config;
    const csvText: string[] = [];
    if (title && title.length > 0) {
        csvText.push(title.join(',') + '\n');
    }
    for (let i = 0; i < data.length; i++) {
        const temp: string[] = [];

        for (let j = 0; j < titleForKey.length; j++) {
        const value = data[i][titleForKey[j]] || '';
        // 如果为数字则加上\t的后缀，避免以科学计数展示
        const prefix = isNaN(+value) || showPureNumber ? '' : '\t';
        temp.push(`"${prefix}${value}"`);
        }
        csvText.push(temp.join(',') + '\n');
    }
    const link = document.createElement('a');
    link.download = fileName;
    const csvData = new Blob(['\ufeff' + csvText.join('')], { type: 'text/csv' });
    link.href = URL.createObjectURL(csvData);
    link.click();
    return csvText;
};

export default {
    formatFileName,
    transformCSVData,
    exportCSV,
}



  