'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import { transformToMobileView } from "@/lib/excel"

export function TableView() {
  const excelData = useAtomValue(excelDataAtom)

  if (!excelData) return null

  const mobileRows = transformToMobileView(excelData)

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="h-[500px]">
        <div className="space-y-4 p-4">
          {mobileRows.map((item, index) => (
            <Card key={index} className="p-4 space-y-2">
              {Object.entries(item).map(([header, cell]) => {
                if (cell.value === null) return null
                return (
                  <div key={header} className="grid grid-cols-3 gap-2">
                    <div className="font-medium text-muted-foreground">{header}</div>
                    <div className="col-span-2">{cell.value}</div>
                  </div>
                )
              })}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
