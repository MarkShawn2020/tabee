import { read, utils } from 'xlsx';
import { DataFrame } from 'danfojs';

export interface ExcelData {
  headers: string[];
  rows: any[][];
  sheetName: string;
  metadata: {
    originalShape: [number, number];
    cleanedShape: [number, number];
    emptyRowsRemoved: number;
    emptyColsRemoved: number;
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
  const originalShape = df.shape;
  
  console.log('📊 Original data info:', {
    shape: originalShape,
    columns: df.columns,
    dtypes: df.dtypes,
    nullCount: df.isNa().sum().values
  });

  // Log sample of original data
  console.log('📊 Original data head (first 10 rows):');
  df.head(10).print();

  // Remove empty rows
  const cleanedDf = df.dropna({ how: 'all', axis: 0 });
  const emptyRowsRemoved = originalShape[0] - cleanedDf.shape[0];

  // Remove empty columns
  const cleanedDf2 = cleanedDf.dropna({ how: 'all', axis: 1 });
  const emptyColsRemoved = cleanedDf.shape[1] - cleanedDf2.shape[1];

  console.log('🧹 Cleaning results:', {
    emptyRowsRemoved,
    emptyColsRemoved,
    finalShape: cleanedDf2.shape
  });

  // Validate dimensions
  if (cleanedDf2.shape[0] > MAX_ROWS) {
    console.warn('❌ Too many rows:', {
      actualRows: cleanedDf2.shape[0],
      maxRows: MAX_ROWS
    });
    throw new ExcelError(`Sheet exceeds ${MAX_ROWS} rows limit`);
  }
  if (cleanedDf2.shape[1] > MAX_COLS) {
    console.warn('❌ Too many columns:', {
      actualColumns: cleanedDf2.shape[1],
      maxColumns: MAX_COLS
    });
    throw new ExcelError(`Sheet exceeds ${MAX_COLS} columns limit`);
  }

  // Extract headers and rows
  const headers = cleanedDf2.columns;
  const rows = cleanedDf2.values;

  console.log('✅ Excel parsing completed:', {
    headers: headers.length,
    rows: rows.length
  });

  return {
    headers,
    rows,
    sheetName: firstSheetName,
    metadata: {
      originalShape,
      cleanedShape: cleanedDf2.shape,
      emptyRowsRemoved,
      emptyColsRemoved
    }
  };
}

export function transformToMobileView(data: ExcelData) {
  console.log('🔄 Starting mobile view transformation');
  
  // Create DataFrame for better data manipulation
  const df = new DataFrame(data.rows, { columns: data.headers });
  
  console.log('📊 Data shape for mobile transformation:', df.shape);
  
  // Transform to mobile-friendly format
  const mobileRows = df.values.map((row, rowIndex) => {
    const transformedRow = df.columns.map((header, colIndex) => ({
      header,
      value: row[colIndex],
    }));

    // Log sample transformations
    if (rowIndex === 0 || rowIndex === df.shape[0] - 1) {
      console.log(`📱 Sample row ${rowIndex}:`, {
        original: row,
        transformed: transformedRow
      });
    }

    return transformedRow;
  });

  console.log('✅ Mobile transformation completed:', {
    totalRows: mobileRows.length,
    rowFormat: 'Array<{ header: string, value: any }>'
  });

  return mobileRows;
}
