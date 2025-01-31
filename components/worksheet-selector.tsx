'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { stepAtom, selectedSheetAtom, selectedTableAtom, headerRowsAtom } from "@/lib/store/steps"
import { rawExcelAtom, excelDataAtom } from "@/lib/store"
import { useAtom, useAtomValue } from "jotai"
import { processSheetData } from "@/lib/excel"

export function WorksheetSelector() {
  const [, setStep] = useAtom(stepAtom)
  const [selectedSheet, setSelectedSheet] = useAtom(selectedSheetAtom)
  const [selectedTable, setSelectedTable] = useAtom(selectedTableAtom)
  const [headerRows, setHeaderRows] = useAtom(headerRowsAtom)
  const rawExcel = useAtomValue(rawExcelAtom)
  const [, setExcelData] = useAtom(excelDataAtom)

  if (!rawExcel) return null

  // 初始化选中值
  if (!selectedSheet && rawExcel.sheets.length > 0) {
    setSelectedSheet(rawExcel.sheets[0].name)
  }

  const currentSheet = rawExcel.sheets.find(s => s.name === selectedSheet)
  const currentData = currentSheet?.data || []

  // 生成数据范围
  const tableRange = currentData.length > 0
    ? `A1:${String.fromCharCode(65 + currentData[0].length - 1)}${currentData.length}`
    : ''

  if (!selectedTable && tableRange) {
    setSelectedTable(tableRange)
  }

  const handleConfirm = () => {
    if (currentSheet) {
      const processedData = processSheetData(
        currentSheet.data,
        currentSheet.name,
        headerRows
      )
      setExcelData(processedData)
      setStep('view')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>工作表</Label>
            <Select value={selectedSheet} onValueChange={setSelectedSheet}>
              <SelectTrigger>
                <SelectValue placeholder="选择工作表" />
              </SelectTrigger>
              <SelectContent>
                {rawExcel.sheets.map(sheet => (
                  <SelectItem key={sheet.name} value={sheet.name}>
                    {sheet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentData.length > 0 && (
            <div className="space-y-2">
              <Label>表头行数</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={headerRows}
                  onChange={e => setHeaderRows(Number(e.target.value))}
                  min={1}
                  max={Math.max(1, currentData.length - 1)}
                  className="w-24"
                />
                <div className="text-sm text-muted-foreground pt-2">
                  最大: {Math.max(1, currentData.length - 1)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {currentData.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <Label>预览</Label>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="border-collapse w-full overflow-scroll">
                  <tbody>
                    {currentData.slice(0, 5).map((row, rowIndex) => (
                      <tr 
                        key={rowIndex}
                        className={`border-b ${rowIndex < headerRows ? 'bg-muted/50' : ''}`}
                      >
                        {row.map((cell, cellIndex) => {
                          if (cell.value === null) return null
                          return (
                            <td 
                              key={cellIndex} 
                              className="p-2 border-r whitespace-nowrap"
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
            </div>
          </ScrollArea>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleConfirm} disabled={!currentData.length}>
          确认并继续
        </Button>
      </div>
    </div>
  )
}
