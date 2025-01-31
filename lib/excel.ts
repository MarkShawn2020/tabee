import { read, utils } from 'xlsx';
import { DataFrame } from 'danfojs';

export interface ExcelData {
  headers: string[];
  rows: any[][];
  sheetName: string;
  metadata: {
    originalShape: [number, number];
    cleanedShape: [number, number];
    headerRows?: number;
  };
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ROWS = 10000;
export const MAX_COLS = 100;

export class ExcelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelError';
  }
}

// 对列进行向下填充，但跳过表头行
function forwardFillColumn(data: any[][], colIndex: number, startRow: number): void {
  let lastValidValue = '';
  for (let rowIndex = startRow; rowIndex < data.length; rowIndex++) {
    const currentValue = data[rowIndex][colIndex];
    if (currentValue === '') {
      data[rowIndex][colIndex] = lastValidValue;
    } else {
      lastValidValue = currentValue;
    }
  }
}

export async function parseExcelFile(file: File): Promise<ExcelData> {
  console.log('🔍 Starting Excel file parsing:', {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    fileType: file.type
  });

  if (file.size > MAX_FILE_SIZE) {
    throw new ExcelError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  const buffer = await file.arrayBuffer();
  const workbook = read(buffer);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // 获取表格的实际范围
  const range = utils.decode_range(worksheet['!ref'] || 'A1');
  const totalCols = range.e.c - range.s.c + 1;

  // 转换为数组，保留空单元格和合并单元格信息
  const rawData = utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    blankrows: true,
  }) as any[][];

  // 确保每行都有相同数量的列
  const normalizedData = rawData.map(row => {
    const newRow = new Array(totalCols).fill('');
    row.forEach((cell, index) => {
      newRow[index] = cell;
    });
    return newRow;
  });

  // Create DataFrame with normalized data
  const df = new DataFrame(normalizedData);
  const shape = df.shape as [number, number];

  if (df.shape[0] > MAX_ROWS) {
    throw new ExcelError(`Sheet exceeds ${MAX_ROWS} rows limit`);
  }
  if (df.shape[1] > MAX_COLS) {
    throw new ExcelError(`Sheet exceeds ${MAX_COLS} columns limit`);
  }

  // 提取列名和数据
  const headers = df.columns.map(String);
  const rows = df.values as any[][];

  return {
    headers,
    rows,
    sheetName: firstSheetName,
    metadata: {
      originalShape: shape,
      cleanedShape: df.shape as [number, number],
    }
  };
}

export function transformToMobileView(data: ExcelData) {
  const { rows, metadata } = data;
  const headerRows = metadata.headerRows || 1;
  
  // 获取表头行和数据行
  const headerRows_ = rows.slice(0, headerRows);
  let dataRows = rows.slice(headerRows);
  
  // 创建数据行的副本进行填充
  const filledDataRows = dataRows.map(row => [...row]);
  
  // 只对数据行进行向下填充
  for (let colIndex = 0; colIndex < filledDataRows[0].length; colIndex++) {
    forwardFillColumn(filledDataRows, colIndex, 0);
  }
  
  // 转换为移动视图格式
  return filledDataRows.map((dataRow, rowIndex) => {
    // 对每一列，收集所有表头行的值作为完整的表头
    return dataRow.map((value, colIndex) => {
      // 构建多级表头
      const header = headerRows_
        .map(headerRow => headerRow[colIndex])
        .filter(h => h !== '') // 移除空字符串
        .join(' - ');
      
      return {
        header,
        value: value
      };
    });
  });
}
