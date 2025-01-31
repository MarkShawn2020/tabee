import { atom } from 'jotai'

export type Step = 'upload' | 'select' | 'view'

export const stepAtom = atom<Step>('upload')

export interface TableInfo {
  sheetName: string
  tableRange: string // e.g., 'A1:D10'
  headerRows: number
}

export const tableInfoAtom = atom<TableInfo | null>(null)
