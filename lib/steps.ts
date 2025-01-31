import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type Step = 'upload' | 'select' | 'view'

export const stepAtom = atom<Step>('upload')

export interface TableInfo {
  sheetName: string
  tableRange: string // e.g., 'A1:D10'
  headerRows: number
}

export const tableInfoAtom = atom<TableInfo | null>(null)

// 工作表选择相关状态
export const selectedSheetAtom = atom<string>('')
export const selectedTableAtom = atom<string>('')
export const headerRowsAtom = atomWithStorage<number>('headerRows', 2)

