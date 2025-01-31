import { useAtomValue, useSetAtom } from 'jotai';
import { excelDataAtom, viewModeAtom, structureAnalysisAtom } from '@/lib/store';
import { transformToMobileView } from '@/lib/excel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

export function TableView() {
  const excelData = useAtomValue(excelDataAtom);
  const viewMode = useAtomValue(viewModeAtom);
  const setViewMode = useSetAtom(viewModeAtom);
  const structureAnalysis = useAtomValue(structureAnalysisAtom);

  if (!excelData) return null;

  const { headers, rows, sheetName } = excelData;
  const mobileRows = transformToMobileView(excelData);

  const handleViewModeChange = (mode: 'table' | 'series') => {
    console.log('👀 Switching view mode:', {
      from: viewMode,
      to: mode,
      dataSize: {
        headers: headers.length,
        rows: rows.length
      }
    });
    setViewMode(mode);
  };

  console.log({structureAnalysis});
  

  return (
    <div className="space-y-4">
      {/* 结构化分析结果 */}
      {structureAnalysis && (
        <Card className="p-4 w-full">
          <div className="flex items-start gap-3 overflow-x-hidden">

            <div className='w-full overflow-x-hidden'>
              <h3 className="font-medium inline-flex items-center gap-2">
              {structureAnalysis.isStructured ? (
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-red-500 mt-0.5" />
            )}

                {structureAnalysis.isStructured ? '表格可以结构化展示' : '表格不适合结构化展示'}
              </h3>

              <p className="text-sm text-gray-500 mt-1">{structureAnalysis.reason}</p>

              {structureAnalysis.isStructured && structureAnalysis.firstRecord && (
                <div className="mt-2 text-sm w-full">
                  <div className="font-medium text-gray-600">数据示例：</div>
                  <pre className="mt-1 p-2 rounded-md overflow-x-auto w-full">
                    {JSON.stringify(structureAnalysis.firstRecord, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
        {viewMode === 'table' ? (
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
                    <div className="font-medium text-sm text-gray-500">{header}</div>
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
