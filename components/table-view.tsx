import { StructureAnalysis } from "@/components/structure-analysis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transformToMobileView } from "@/lib/excel";
import {
  excelDataAtom,
  structureAnalysisAtom,
  viewModeAtom,
} from "@/lib/store";
import { useAtomValue } from "jotai";

export function TableView() {
  const excelData = useAtomValue(excelDataAtom);
  const viewMode = useAtomValue(viewModeAtom);
  const structureAnalysis = useAtomValue(structureAnalysisAtom);

  if (!excelData) return null;

  const { headers, rows, sheetName } = excelData;
  const mobileRows = transformToMobileView(excelData);

  console.log({ structureAnalysis, excelData, mobileRows });

  return (
    <div className="space-y-4">
      {/* 结构化分析结果 */}
      {/* {structureAnalysis && (
        <StructureAnalysis structureAnalysis={structureAnalysis} />
      )} */}

      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
        {viewMode === "table" ? (
          <table className="w-full">
            <thead className="sticky top-0 bg-background border-b">
              <tr>
                {headers.map((header, i) => (
                  <th key={i} className="p-2 text-left font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">
                  {row.map((cell, j) => (
                    <td key={j} className="p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="divide-y">
            {mobileRows.map((row, rowIndex) => (
              <div key={rowIndex} className="p-4 space-y-2">
                {row.map(({ header, value }, cellIndex) => (
                  <div key={cellIndex} className="flex justify-between gap-4">
                    <div className="font-medium text-sm text-gray-500">
                      {header}
                    </div>
                    <div className="text-right">{value}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
