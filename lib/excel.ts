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

  // Convert to array of arrays
  const rawData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  // Create DataFrame
  const df = new DataFrame(rawData);
  const shape = df.shape as [number, number];
  
  console.log('📊 Original data info:', {
    shape,
    columns: df.columns,
    dtypes: df.dtypes,
    nullCount: df.isNa().sum().values
  });

  // Log sample of original data
  console.log('📊 Original data head (first 10 rows):');
  df.head(10).print();

  // Remove empty rows
  // df.dropNa({ axis: 0, inplace: true,  });
  // Remove empty columns
  // df.dropNa({ axis: 1, inplace: true });

  console.log('🧹 Cleaning results:', {
    finalShape: df.shape
  });

  // Validate dimensions
  if (df.shape[0] > MAX_ROWS) {
    console.warn('❌ Too many rows:', {
      actualRows: df.shape[0],
      maxRows: MAX_ROWS
    });
    throw new ExcelError(`Sheet exceeds ${MAX_ROWS} rows limit`);
  }
  if (df.shape[1] > MAX_COLS) {
    console.warn('❌ Too many columns:', {
      actualColumns: df.shape[1],
      maxColumns: MAX_COLS
    });
    throw new ExcelError(`Sheet exceeds ${MAX_COLS} columns limit`);
  }

  // Extract headers and rows
  const headers = df.columns.map(String);
  const rows = df.values as any[][];

  console.log('✅ Excel parsing completed:', {
    headers: headers.length,
    rows: rows.length
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
  const { headers, rows, metadata } = data;
  const headerRows = metadata.headerRows || 1;
  
  // 获取实际的数据行（排除表头行）
  const dataRows = rows.slice(headerRows);
  
  // 转换为移动视图格式
  return dataRows.map(row => {
    return headers.map((header, index) => ({
      header,
      value: row[index]
    }));
  });
}
