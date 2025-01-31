'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { excelDataAtom, viewModeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { useState } from "react"

export function TablePreview() {
  const [excelData, setExcelData] = useAtom(excelDataAtom)
  const [viewMode, setViewMode] = useAtom(viewModeAtom)
  const [headerRows, setHeaderRows] = useState(1)

  if (!excelData) return null

  const { headers, rows, sheetName } = excelData

  const handleConfirm = () => {
    setExcelData({
      ...excelData,
      metadata: {
        ...excelData.metadata,
        headerRows
      }
    })
    setViewMode('series')
  }

  const isHeaderRow = (rowIndex: number) => rowIndex < headerRows

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{sheetName}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">表头行数：</label>
            <Input
              type="number"
              value={headerRows}
              onChange={(e) => setHeaderRows(Number(e.target.value))}
              min={1}
              max={Math.max(1, rows.length - 1)}
              className="w-20"
            />
          </div>
          <Button onClick={handleConfirm}>确认并进入移动视图</Button>
        </div>
      </div>

      <div className="relative rounded-md border">
        <ScrollArea className="h-[calc(100vh-200px)] w-full">
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-background border-b">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="p-2 text-left font-medium text-sm border-r last:border-r-0 whitespace-nowrap"
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
                        className="p-2 border-r last:border-r-0 whitespace-nowrap"
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
    </div>
  )
}
