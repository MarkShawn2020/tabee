'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { stepAtom, tableInfoAtom, selectedSheetAtom, selectedTableAtom, headerRowsAtom } from "@/lib/store/steps"
import { useAtom } from "jotai"
import { ExcelData } from "@/lib/excel"

interface Props {
  workbook: {
    sheets: {
      name: string
      tables: Array<{
        range: string
        preview: ExcelData
      }>
    }[]
  }
}

export function WorksheetSelector({ workbook }: Props) {
  const [, setStep] = useAtom(stepAtom)
  const [, setTableInfo] = useAtom(tableInfoAtom)
  const [selectedSheet, setSelectedSheet] = useAtom(selectedSheetAtom)
  const [selectedTable, setSelectedTable] = useAtom(selectedTableAtom)
  const [headerRows, setHeaderRows] = useAtom(headerRowsAtom)

  // 初始化选中值
  if (!selectedSheet && workbook.sheets.length > 0) {
    setSelectedSheet(workbook.sheets[0].name)
  }
  if (!selectedTable && workbook.sheets[0]?.tables.length > 0) {
    setSelectedTable(workbook.sheets[0].tables[0].range)
  }

  const currentSheet = workbook.sheets.find(s => s.name === selectedSheet)
  const currentTable = currentSheet?.tables.find(t => t.range === selectedTable)

  const handleConfirm = () => {
    if (currentSheet && currentTable) {
      setTableInfo({
        sheetName: selectedSheet,
        tableRange: selectedTable,
        headerRows
      })
      setStep('view')
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>工作表</Label>
            <Select value={selectedSheet} onValueChange={setSelectedSheet}>
              <SelectTrigger>
                <SelectValue placeholder="选择工作表" />
              </SelectTrigger>
              <SelectContent>
                {workbook.sheets.map(sheet => (
                  <SelectItem key={sheet.name} value={sheet.name}>
                    {sheet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>数据范围</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger>
                <SelectValue placeholder="选择数据范围" />
              </SelectTrigger>
              <SelectContent>
                {currentSheet?.tables.map(table => (
                  <SelectItem key={table.range} value={table.range}>
                    {table.range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>表头行数</Label>
            <Input
              type="number"
              value={headerRows}
              onChange={e => setHeaderRows(Number(e.target.value))}
              min={1}
              max={currentTable ? Math.max(1, currentTable.preview.rows.length - 1) : 1}
            />
          </div>
        </div>
      </Card>

      {currentTable && (
        <Card className="p-4 space-y-4">
          <Label>预览</Label>
          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {currentTable.preview.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr 
                      key={rowIndex}
                      className={`border-b ${rowIndex < headerRows ? 'bg-muted/50' : ''}`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-2 border-r">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleConfirm} disabled={!currentTable}>
          确认并继续
        </Button>
      </div>
    </div>
  )
}
