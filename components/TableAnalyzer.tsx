import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface AnalysisResult {
  isStructured: boolean
  headers?: string[]
  firstRecord?: any
  reason: string
}

export function TableAnalyzer({ file }: { file: File }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeTable = async () => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/table-analysis', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing table:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="p-4 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">表格分析</h3>
          <Button
            onClick={analyzeTable}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '分析中...' : '开始分析'}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <Progress value={45} />
            <p className="text-sm text-gray-500">正在分析表格结构...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                analysis.isStructured ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-medium">
                {analysis.isStructured ? '可以结构化展示' : '不适合结构化展示'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{analysis.reason}</p>
            
            {analysis.isStructured && analysis.firstRecord && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">数据示例：</h4>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(analysis.firstRecord, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
