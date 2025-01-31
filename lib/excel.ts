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

// 对列进行向下填充
function forwardFillColumn(data: any[][], colIndex: number): void {
  let lastValidValue = '';
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
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

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    console.warn('❌ File size exceeds limit:', {
      actualSize: file.size,
      maxSize: MAX_FILE_SIZE
    });
    throw new ExcelError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  // Read file
  console.log('📖 Reading file buffer...');
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer);

  console.log('📑 Workbook info:', {
    sheetNames: workbook.SheetNames,
    numberOfSheets: workbook.SheetNames.length
  });

  // Get first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to array of arrays, preserving empty cells
  const rawData = utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '', // 设置空单元格的默认值为空字符串
    blankrows: true, // 保留空行
  }) as any[][];

  // 获取表格的实际范围
  const range = utils.decode_range(worksheet['!ref'] || 'A1');
  const totalCols = range.e.c - range.s.c + 1;

  // 确保每行都有相同数量的列
  const normalizedData = rawData.map(row => {
    const newRow = new Array(totalCols).fill('');
    row.forEach((cell, index) => {
      newRow[index] = cell;
    });
    return newRow;
  });

  // 对每一列进行向下填充
  for (let colIndex = 0; colIndex < totalCols; colIndex++) {
    forwardFillColumn(normalizedData, colIndex);
  }

  // Create DataFrame with normalized data
  const df = new DataFrame(normalizedData);
  const shape = df.shape as [number, number];

  console.log('📊 Data shape:', shape);

  // Validate dimensions
  if (df.shape[0] > MAX_ROWS) {
    throw new ExcelError(`Sheet exceeds ${MAX_ROWS} rows limit`);
  }
  if (df.shape[1] > MAX_COLS) {
    throw new ExcelError(`Sheet exceeds ${MAX_COLS} columns limit`);
  }

  // Extract headers and rows
  const headers = df.columns.map(String);
  const rows = df.values as any[][];

  console.log('✅ Excel parsing completed:', {
    headers: headers.length,
    rows: rows.length,
  });

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
  const dataRows = rows.slice(headerRows);
  
  // 转换为移动视图格式
  return dataRows.map(dataRow => {
    // 对每一列，收集所有表头行的值作为完整的表头
    return dataRow.map((value, colIndex) => {
      const header = headerRows_
        .map(headerRow => headerRow[colIndex] || '')
        .join(' - ');
      
      return {
        header,
        value: value || ''  // 确保空值显示为空字符串
      };
    });
  });
}
