'use client'

import { TablePreview } from "@/components/table-preview"
import { TableView } from "@/components/table-view"
import { UploadZone } from '@/components/upload-zone'
import { WorksheetSelector } from "@/components/worksheet-selector"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { excelDataAtom, errorAtom, loadingAtom, viewModeAtom } from '@/lib/store'
import { stepAtom } from "@/lib/store/steps"
import { useAtom, useAtomValue } from 'jotai'

export default function Home() {
  const [excelData, setExcelData] = useAtom(excelDataAtom)
  const [step, setStep] = useAtom(stepAtom)
  const loading = useAtomValue(loadingAtom)
  const error = useAtomValue(errorAtom)
  const [viewMode, setViewMode] = useAtom(viewModeAtom)

  // 渲染当前步骤
  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <UploadZone/>
          </div>
        )
      
      case 'select':
        if (!excelData) return null
        return (
          <div className="max-w-4xl mx-auto">
            <WorksheetSelector
              workbook={{
                sheets: [{
                  name: excelData.sheetName,
                  tables: [{
                    range: 'A1:' + String.fromCharCode(65 + excelData.headers.length - 1) + excelData.rows.length,
                    preview: excelData
                  }]
                }]
              }}
            />
          </div>
        )
      
      case 'view':
        if (!excelData) return null
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="view-mode">移动视图</Label>
                <Switch
                  id="view-mode"
                  checked={viewMode === "series"}
                  onCheckedChange={(checked) => setViewMode(checked ? "series" : "table")}
                />
              </div>
            </div>
            {viewMode === 'table' ? <TablePreview /> : <TableView />}
          </div>
        )
    }
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">TaBee</h1>
        <div className="flex items-center justify-center gap-2">
          <Step active={step === 'upload'}>上传表格</Step>
          <Divider />
          <Step active={step === 'select'}>选择工作表</Step>
          <Divider />
          <Step active={step === 'view'}>查看数据</Step>
        </div>
      </div>

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

      {!loading && !error && renderStep()}
    </main>
  )
}

// 步骤指示器组件
function Step({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <div className={`px-4 py-2 rounded-full text-sm ${
      active ? 'bg-primary text-primary-foreground' : 'bg-muted'
    }`}>
      {children}
    </div>
  )
}

// 步骤分隔符
function Divider() {
  return <div className="h-px w-8 bg-border" />
}
