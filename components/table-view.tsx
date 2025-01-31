import { useAtomValue, useSetAtom } from 'jotai';
import { excelDataAtom, viewModeAtom } from '@/lib/store';
import { transformToMobileView } from '@/lib/excel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TableView() {
  const excelData = useAtomValue(excelDataAtom);
  const viewMode = useAtomValue(viewModeAtom);
  const setViewMode = useSetAtom(viewModeAtom);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{sheetName}</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => handleViewModeChange('table')}
            size="sm"
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'series' ? 'default' : 'outline'}
            onClick={() => handleViewModeChange('series')}
            size="sm"
          >
            Series
          </Button>
        </div>
      </div>

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
