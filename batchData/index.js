const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// 处理excel中的批量账号数据

// 当前文件夹的路径
const folderPath = __dirname;
// 读取当前文件夹下的所有文件
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('读取文件夹时出错：', err);
    return;
  }

  // 筛选出 Excel 文件
  const excelFiles = files.filter(file => path.extname(file).toLowerCase() === '.xlsx' || path.extname(file).toLowerCase() === '.xls');

  // 遍历每个 Excel 文件
  excelFiles.forEach(file => {
    // 读取 Excel 文件
    const workbook = xlsx.readFile(path.join(folderPath, file));

    // 获取第一个工作表的名称
    const firstSheetName = workbook.SheetNames[0];

    // 获取第一个工作表
    const worksheet = workbook.Sheets[firstSheetName];

    // 将 Excel 中第一列数据转换成字符串数组
    const columnData = [];
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    for (let i = range.s.r; i <= range.e.r; i++) {
      const cellAddress = { r: i, c: range.s.c }; // 第一列的单元格坐标
      const cellRef = xlsx.utils.encode_cell(cellAddress); // 单元格地址
      const cellValue = worksheet[cellRef] ? worksheet[cellRef].v : ''; // 单元格值
      columnData.push(cellValue);
    }
    // 将 JSON 数据转换为字符串
  const jsonStringArr = JSON.stringify(columnData);

  // 将字符串写入到文件中
  fs.writeFile("cointool_sanqianß.json", jsonStringArr, "utf8", (err) => {
    if (err) {
      console.error("写入文件时出错：", err);
      return;
    } 
  });
  });
});
