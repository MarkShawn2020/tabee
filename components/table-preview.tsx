'use client'

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"

export function TablePreview() {
  const excelData = useAtomValue(excelDataAtom)

  if (!excelData) return null

  const { headers, rows, metadata } = excelData
  const headerRows = metadata.headerRows || 1

  // 高亮显示表头行
  const isHeaderRow = (rowIndex: number) => rowIndex < headerRows

  return (
    <div className="relative rounded-md border">
      <ScrollArea className="h-[calc(100vh-200px)] w-full">
        <div className="min-w-max">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-background border-b">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="p-2 text-left font-medium text-sm border-r last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`border-b last:border-b-0 ${
                    isHeaderRow(rowIndex) ? 'bg-muted/50' : ''
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="p-2 border-r last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}
