import { atom } from 'jotai';
import { ExcelData } from './excel';

export interface StructureAnalysis {
  isStructured: boolean;
  headers?: string[];
  firstRecord?: any;
  reason: string;
}

export const excelDataAtom = atom<ExcelData | null>(null);
export const viewModeAtom = atom<'table' | 'series'>('table');
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
export const structureAnalysisAtom = atom<StructureAnalysis | null>(null);
