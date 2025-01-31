'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import { transformToMobileView } from "@/lib/excel"
import { cn } from "@/lib/utils"

export function TableView() {
  const excelData = useAtomValue(excelDataAtom)
  if (!excelData) return null

  const mobileTables = transformToMobileView(excelData)
  console.log({mobileTables});
  
  return (
    <div className="overflow-hidden w-full">
      <ScrollArea className="h-[500px] w-full">
        <div className="space-y-4 p-4 w-full">
          {mobileTables.map((table, tableIndex) => (
            <Card key={tableIndex} className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-background table-fixed">
                  <tbody>
                    {/* 遍历每一列的表头（现在是行） */}
                    {table.headers.map((headerColumn, rowIndex) => (
                      <tr key={rowIndex} className="border-b last:border-b-0">
                        {/* 渲染表头单元格 */}
                        {headerColumn.map((cell, colIndex) => {
                          if (cell.value === null) return null
                          return (
                            <td
                              key={colIndex}
                              className={cn(
                                "p-2 border-r align-middle break-words",
                                "bg-muted/50 font-medium text-muted-foreground"
                              )}
                              rowSpan={cell.rowSpan}
                              colSpan={cell.colSpan}
                              style={{ width: '40%' }}
                            >
                              {cell.value}
                            </td>
                          )
                        })}
                        {/* 渲染该列对应的数据单元格 */}
                        <td
                          className="p-2 border-l align-middle break-words"
                          style={{ width: '60%' }}
                        >
                          {table.data[rowIndex]?.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
