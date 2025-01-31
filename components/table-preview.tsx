'use client'

import { Card } from "@/components/ui/card"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import { RowNumber } from "@/components/ui/row-number"

export function TablePreview() {
  const excelData = useAtomValue(excelDataAtom)

  if (!excelData) return null

  const { rows, metadata: { headerRows } } = excelData

  return (
    <Card className="w-full">
      <div className="w-full h-[500px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-background z-10">
            {Array(headerRows).fill(0).map((_, i) => (
              <tr key={i} className="border-b">
                <RowNumber index={i} isHeader={true} variant="subtle" />
                {rows[i].map((cell, j) => {
                  if (cell.value === null) return null
                  return (
                    <th 
                      key={j}
                      className="p-2 text-left font-medium text-muted-foreground border-r whitespace-nowrap bg-card"
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
          <tbody>
            {rows.slice(headerRows).map((row, i) => (
              <tr key={i} className="border-b hover:bg-muted/50">
                <RowNumber index={i + headerRows} isHeader={false} variant="subtle" />
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
      </div>
    </Card>
  )
}
