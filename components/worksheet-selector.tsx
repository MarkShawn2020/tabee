'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { stepAtom, selectedSheetAtom, selectedTableAtom, headerRowsAtom, maxHeaderRowsAtom } from "@/lib/store/steps"
import { rawExcelAtom, excelDataAtom } from "@/lib/store"
import { useAtom, useAtomValue } from "jotai"
import { processSheetData } from "@/lib/excel"
import { ScrollAreaScrollbar } from "@radix-ui/react-scroll-area"

export function WorksheetSelector() {
  const [, setStep] = useAtom(stepAtom)
  const [selectedSheet, setSelectedSheet] = useAtom(selectedSheetAtom)
  const [selectedTable, setSelectedTable] = useAtom(selectedTableAtom)
  const [headerRows, setHeaderRows] = useAtom(headerRowsAtom)
  const rawExcel = useAtomValue(rawExcelAtom)
  const [, setExcelData] = useAtom(excelDataAtom)
  const maxHeaderRows = useAtomValue(maxHeaderRowsAtom)

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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>表头行数</Label>
                <span className="text-sm text-muted-foreground">
                  {headerRows} / {maxHeaderRows}
                </span>
              </div>
              <Slider
                value={[headerRows]}
                onValueChange={([value]) => setHeaderRows(value)}
                min={0}
                max={maxHeaderRows}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>
      </Card>

      {currentData.length > 0 && (
        <Card>
          <div className="p-4 border-b bg-muted/50">
            <Label>预览</Label>
          </div>
          <div className="h-[300px] relative">
            <div className="absolute inset-0 overflow-auto touch-pan-x touch-pan-y overscroll-x-contain">
              <div className="p-4 min-w-full">
                <table className="w-full border-collapse">
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
                              className="p-2 border-r break-words"
                              rowSpan={cell.rowSpan}
                              colSpan={cell.colSpan}
                              style={{ minWidth: '120px' }}
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
          </div>
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
