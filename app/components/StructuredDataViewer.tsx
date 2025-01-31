import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as XLSX from 'xlsx'

interface StructuredDataViewerProps {
  file: File
  headers: string[]
}

export function StructuredDataViewer({ file, headers }: StructuredDataViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 1 // 每页显示一条记录

  const loadData = async () => {
    setLoading(true)
    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet)
      setData(jsonData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 首次加载数据
  if (data.length === 0 && !loading) {
    loadData()
  }

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const currentData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <Card className="p-4 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">结构化数据查看</h3>
          <div className="text-sm text-gray-500">
            第 {currentPage + 1} / {totalPages} 条
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : (
          <>
            {currentData.map((item, index) => (
              <div key={index} className="space-y-2">
                {headers.map((header) => (
                  <div key={header} className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-gray-600">{header}</div>
                    <div className="col-span-2">{item[header]}</div>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
