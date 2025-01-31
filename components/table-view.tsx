'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import { transformToMobileView, type MobileViewTable, type CellInfo } from "@/lib/excel"
import { cn } from "@/lib/utils"

export function TableView() {
  const excelData = useAtomValue(excelDataAtom)
  if (!excelData) return null

  const mobileTables = transformToMobileView(excelData)

  return (
    <div className="overflow-hidden">
      <ScrollArea className="h-[500px]">
        <div className="space-y-4 p-4">
          {mobileTables.map((table, tableIndex) => (
            <Card key={tableIndex} className="overflow-hidden">
              <table className="w-full border-collapse bg-background">
                <tbody>
                  {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b last:border-b-0">
                      {row.map((cell, colIndex) => {
                        if (cell.value === null) return null

                        const isLastColumn = colIndex === row.length - 1

                        return (
                          <td
                            key={colIndex}
                            className={cn(
                              "p-2 border-r last:border-r-0 align-middle whitespace-nowrap",
                              !isLastColumn && "bg-muted/30",
                              colIndex === 0 && "font-semibold bg-muted/50",
                              ((cell.rowSpan || 1) > 1 || (cell.colSpan || 1) > 1) && "bg-muted/40"
                            )}
                            rowSpan={cell.rowSpan || 1}
                            colSpan={cell.colSpan || 1}
                          >
                            {cell.value}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
