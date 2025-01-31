'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"

export function TablePreview() {
  const excelData = useAtomValue(excelDataAtom)

  if (!excelData) return null

  const { rows, metadata: { headerRows } } = excelData

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* 固定表头 */}
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            {Array(headerRows).fill(0).map((_, i) => (
              <tr key={i} className="bg-card border-b">
                {rows[i].map((cell, j) => {
                  if (cell.value === null) return null
                  return (
                    <th 
                      key={j}
                      className="p-2 text-left font-medium text-muted-foreground border-r whitespace-nowrap"
                      rowSpan={cell.rowSpan}
                      colSpan={cell.colSpan}
                    >
                      {cell.value}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
        </table>

        {/* 数据区域 */}
        <ScrollArea className="h-[500px]">
          <table className="w-full border-collapse">
            <tbody>
              {rows.slice(headerRows).map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/50">
                  {row.map((cell, j) => {
                    if (cell.value === null) return null
                    return (
                      <td 
                        key={j} 
                        className="p-2 border-r"
                        rowSpan={cell.rowSpan}
                        colSpan={cell.colSpan}
                      >
                        {cell.value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </Card>
  )
}
