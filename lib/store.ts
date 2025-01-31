import { atom } from 'jotai';
import { ExcelData } from './excel';

export const excelDataAtom = atom<ExcelData | null>(null);
export const viewModeAtom = atom<'table' | 'series'>('table');
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
