import { read, utils } from 'xlsx'

export class ExcelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExcelError'
  }
}

export interface CellInfo {
  value: any
  rowSpan?: number
  colSpan?: number
}

export interface ExcelData {
  sheetName: string
  headers: string[]
  rows: CellInfo[][]
  metadata: {
    headerRows: number
  }
}

export interface WorksheetInfo {
  name: string
  data: CellInfo[][]
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

          const cleanedData = cleanData(data)
          const processedData = processMerges(worksheet, cleanedData)

          return {
            name,
            data: processedData
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
 * 处理合并单元格信息
 */
function processMerges(worksheet: any, data: any[][]): CellInfo[][] {
  const result: CellInfo[][] = data.map(row => 
    row.map(value => ({ value }))
  )
  
  // 获取合并单元格信息
  const merges = worksheet['!merges'] || []
  
  // 处理每个合并区域
  for (const merge of merges) {
    const { s: start, e: end } = merge
    
    // 设置主单元格的 span
    result[start.r][start.c] = {
      value: data[start.r][start.c],
      rowSpan: end.r - start.r + 1,
      colSpan: end.c - start.c + 1
    }
    
    // 将合并区域内的其他单元格设置为 null
    for (let r = start.r; r <= end.r; r++) {
      for (let c = start.c; c <= end.c; c++) {
        if (r !== start.r || c !== start.c) {
          result[r][c] = { value: null }
        }
      }
    }
  }
  
  return result
}

/**
 * 根据工作表数据和配置生成最终的表格数据
 */
export function processSheetData(
  sheetData: CellInfo[][],
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
  const headers = sheetData[headerRows - 1].map(cell => String(cell.value || ''))

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

export interface MobileViewTable {
  rows: CellInfo[][]  // 旋转后的行数据，每行是一个字段，包含表头和值
}

/**
 * 转换为移动视图格式，每个数据行生成一个旋转90度的表格
 */
export function transformToMobileView(data: ExcelData): MobileViewTable[] {
  const { rows, metadata: { headerRows } } = data
  
  // 提取表头行和数据行
  const headerRows_ = rows.slice(0, headerRows)
  const dataRows = rows.slice(headerRows)
  
  // 为每个数据行生成一个旋转的表格
  return dataRows.map(dataRow => {
    const pivotedRows: CellInfo[][] = []
    
    // 遍历每一列
    for (let colIndex = 0; colIndex < dataRow.length; colIndex++) {
      const value = dataRow[colIndex]
      // 跳过空列
      if (value.value === null) continue
      
      // 获取该列的所有表头
      const headerCells = headerRows_.map(headerRow => headerRow[colIndex])
      // 如果所有表头都是空的，跳过这一列
      if (headerCells.every(cell => !cell.value)) continue
      
      // 创建新的行
      const newRow: CellInfo[] = new Array(headerRows + 1).fill(null).map(() => ({ value: null }))
      
      // 处理表头单元格
      for (let i = 0; i < headerCells.length; i++) {
        const cell = headerCells[i]
        if (cell.value === null) continue
        
        // 如果原来有 rowSpan，现在变成 colSpan
        newRow[i] = {
          value: cell.value,
          colSpan: cell.rowSpan,
          rowSpan: cell.colSpan
        }
        
        // 如果有 colSpan，将后面的单元格标记为已使用
        if (cell.rowSpan) {
          for (let j = 1; j < cell.rowSpan; j++) {
            if (i + j < headerRows) {
              newRow[i + j] = { value: null }
            }
          }
        }
      }
      
      // 添加数据值作为最后一列
      newRow[headerRows] = value
      
      pivotedRows.push(newRow)
    }
    
    return { rows: pivotedRows }
  })
}
