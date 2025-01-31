import { read, utils } from 'xlsx'

export class ExcelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExcelError'
  }
}

export interface ExcelData {
  sheetName: string
  headers: string[]
  rows: any[][]
  metadata: {
    headerRows: number
  }
}

export interface WorksheetInfo {
  name: string
  data: any[][]
}

export interface ParsedExcel {
  sheets: WorksheetInfo[]
}

/**
 * 解析 Excel 文件，返回所有工作表信息
 */
export function parseExcelFile(file: File): Promise<ParsedExcel> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new ExcelError('无法读取文件')
        }

        const workbook = read(e.target.result, { type: 'array' })
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new ExcelError('Excel 文件中没有工作表')
        }

        const sheets: WorksheetInfo[] = workbook.SheetNames.map(name => {
          const worksheet = workbook.Sheets[name]
          const data = utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            blankrows: true,
          }) as any[][]

          return {
            name,
            data: cleanData(data)
          }
        })

        resolve({ sheets })
      } catch (err) {
        if (err instanceof ExcelError) {
          reject(err)
        } else {
          reject(new ExcelError('处理 Excel 文件时出错'))
        }
      }
    }

    reader.onerror = () => {
      reject(new ExcelError('读取文件时出错'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * 根据工作表数据和配置生成最终的表格数据
 */
export function processSheetData(
  sheetData: any[][],
  sheetName: string,
  headerRows: number
): ExcelData {
  if (!sheetData || sheetData.length === 0) {
    throw new ExcelError('工作表数据为空')
  }

  // 确保表头行数合理
  if (headerRows < 1 || headerRows >= sheetData.length) {
    throw new ExcelError('表头行数设置不正确')
  }

  // 提取表头
  const headers = sheetData[headerRows - 1].map(cell => String(cell || ''))

  return {
    sheetName,
    headers,
    rows: sheetData,
    metadata: {
      headerRows
    }
  }
}

/**
 * 清理数据：移除空行和空列
 */
function cleanData(data: any[][]): any[][] {
  if (data.length === 0) return data

  // 移除末尾的空行
  let lastNonEmptyRow = data.length - 1
  while (lastNonEmptyRow >= 0 && data[lastNonEmptyRow].every(cell => !cell)) {
    lastNonEmptyRow--
  }

  // 移除末尾的空列
  const maxCols = Math.max(...data.slice(0, lastNonEmptyRow + 1).map(row => row.length))
  let lastNonEmptyCol = maxCols - 1
  while (lastNonEmptyCol >= 0 && data.every(row => !row[lastNonEmptyCol])) {
    lastNonEmptyCol--
  }

  // 裁剪数据
  return data
    .slice(0, lastNonEmptyRow + 1)
    .map(row => row.slice(0, lastNonEmptyCol + 1))
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ROWS = 10000;
export const MAX_COLS = 100;

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
  return filledDataRows.map(dataRow => {
    return dataRow.map((value, colIndex) => {
      // 构建多级表头
      const header = headerRows_
        .map(headerRow => headerRow[colIndex])
        .filter(h => h !== '') // 移除空字符串
        .join(' - ');
      
      return {
        header,
        value
      };
    });
  });
}
