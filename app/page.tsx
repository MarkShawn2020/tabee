'use client'

import { TablePreview } from "@/components/table-preview"
import { TableView } from "@/components/table-view"
import { UploadZone } from '@/components/upload-zone'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { excelDataAtom, errorAtom, loadingAtom, viewModeAtom } from '@/lib/store'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from "react"

export default function Home() {
  const [excelData, setExcelData] = useAtom(excelDataAtom)
  const loading = useAtomValue(loadingAtom)
  const error = useAtomValue(errorAtom)
  const [viewMode, setViewMode] = useAtom(viewModeAtom)
  const [headerRows, setHeaderRows] = useState(1)

  const handleHeaderRowsChange = (newHeaderRows: number) => {
    setHeaderRows(newHeaderRows)
    if (excelData) {
      setExcelData({
        ...excelData,
        metadata: {
          ...excelData.metadata,
          headerRows: newHeaderRows
        }
      })
    }
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      {!excelData && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <UploadZone />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            <p className="text-sm text-gray-500">处理中...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">{error}</div>
        </div>
      )}

      {excelData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{excelData.sheetName}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="header-rows">表头行数</Label>
                <Input
                  id="header-rows"
                  type="number"
                  value={headerRows}
                  onChange={(e) => handleHeaderRowsChange(Number(e.target.value))}
                  min={1}
                  max={Math.max(1, excelData.rows.length - 1)}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="view-mode">移动视图</Label>
                <Switch
                  id="view-mode"
                  checked={viewMode === "series"}
                  onCheckedChange={(checked) => setViewMode(checked ? "series" : "table")}
                />
              </div>
            </div>
          </div>
          {viewMode === 'table' ? <TablePreview /> : <TableView />}
        </div>
      )}
    </main>
  )
}
