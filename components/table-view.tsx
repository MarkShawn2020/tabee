'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { transformToMobileView } from "@/lib/excel"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"

export function TableView() {
  const excelData = useAtomValue(excelDataAtom)

  if (!excelData) return null

  const { rows } = excelData
  const mobileRows = transformToMobileView(excelData)

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
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
      </ScrollArea>
    </div>
  )
}
