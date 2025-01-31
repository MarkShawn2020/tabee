'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import { transformToMobileView } from "@/lib/excel"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function TableView() {
  const excelData = useAtomValue(excelDataAtom)
  if (!excelData) return null

  const mobileTables = transformToMobileView(excelData)
  
  return (
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 pb-4">
          {mobileTables.map((table, tableIndex) => (
            <Card key={tableIndex} className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
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
                                "p-3 border-r align-middle break-words",
                                "bg-muted/50 font-medium text-muted-foreground text-sm"
                              )}
                              rowSpan={cell.rowSpan}
                              colSpan={cell.colSpan}
                              style={{ width: '40%', minWidth: '120px' }}
                            >
                              {cell.value}
                            </td>
                          )
                        })}
                        {/* 渲染该列对应的数据单元格 */}
                        <td
                          className="p-3 border-l align-middle break-words"
                          style={{ width: '60%' }}
                        >
                          {table.data[rowIndex]?.value ? (
                            <span className="text-sm">
                              {table.data[rowIndex].value}
                            </span>
                          ) : (
                            <Badge variant="secondary" className="font-normal">
                              无数据
                            </Badge>
                          )}
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
