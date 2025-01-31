import { atom } from "jotai";
import { ExcelData, ParsedExcel } from "./excel";

export interface IStructureAnalysis {
  isStructured: boolean;
  headers?: string[];
  firstRecord?: any;
  reason: string;
}

// 原始的 Excel 数据
export const rawExcelAtom = atom<ParsedExcel | null>(null);

// 处理后的表格数据
export const excelDataAtom = atom<ExcelData | null>(null);

// 加载状态
export const loadingAtom = atom<boolean>(false);

// 错误信息
export const errorAtom = atom<string | null>(null);

// 视图模式
export type ViewMode = "desktop" | "mobile";
export const viewModeAtom = atom<ViewMode>("desktop");

export const structureAnalysisAtom = atom<IStructureAnalysis | null>(null);
