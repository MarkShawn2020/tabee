'use client'

import { TablePreview } from "@/components/table-preview"
import { TableView } from "@/components/table-view"
import { UploadZone } from '@/components/upload-zone'
import { WorksheetSelector } from "@/components/worksheet-selector"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { excelDataAtom, errorAtom, loadingAtom, viewModeAtom } from '@/lib/store'
import { Step as StepType, stepAtom } from "@/lib/store/steps"
import { useAtom, useAtomValue } from 'jotai'

export default function Home() {
  const [excelData, setExcelData] = useAtom(excelDataAtom)
  const [step, setStep] = useAtom(stepAtom)
  const loading = useAtomValue(loadingAtom)
  const error = useAtomValue(errorAtom)
  const [viewMode, setViewMode] = useAtom(viewModeAtom)

  // 判断步骤是否可用
  const canAccessStep = (targetStep: StepType): boolean => {
    if (targetStep === 'upload') return true
    if (targetStep === 'select') return !!excelData
    if (targetStep === 'view') return !!excelData
    return false
  }

  // 处理步骤点击
  const handleStepClick = (targetStep: StepType) => {
    if (canAccessStep(targetStep)) {
      setStep(targetStep)
    }
  }

  // 渲染当前步骤
  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <UploadZone />
          </div>
        )
      
      case 'select':
        return (
          <div className="w-full max-w-4xl mx-auto px-4">
            <WorksheetSelector />
          </div>
        )
      
      case 'view':
        if (!excelData) return null
        return (
          <div className="space-y-4 px-4">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="view-mode" className="hidden sm:inline-block">移动视图</Label>
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
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto py-4">
          <div className="text-center space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold">TaBee</h1>
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              <Step 
                step="upload" 
                active={step === 'upload'} 
                available={canAccessStep('upload')}
                onClick={() => handleStepClick('upload')}
              >
                上传
              </Step>
              <Divider />
              <Step 
                step="select" 
                active={step === 'select'} 
                available={canAccessStep('select')}
                onClick={() => handleStepClick('select')}
              >
                选择
              </Step>
              <Divider />
              <Step 
                step="view" 
                active={step === 'view'} 
                available={canAccessStep('view')}
                onClick={() => handleStepClick('view')}
              >
                查看
              </Step>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4">
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
      </div>
    </main>
  )
}

// 步骤指示器组件
interface StepProps {
  children: React.ReactNode
  active: boolean
  available: boolean
  step: StepType
  onClick: () => void
}

function Step({ children, active, available, onClick }: StepProps) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : available
            ? 'bg-muted hover:bg-muted/80 cursor-pointer'
            : 'bg-muted/50 cursor-not-allowed'
      }`}
    >
      {children}
    </button>
  )
}

// 步骤分隔符
function Divider() {
  return <div className="h-px w-4 sm:w-8 bg-border" />
}
