'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { transformToMobileView } from "@/lib/excel"
import { excelDataAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { TableView } from "@/components/table-view"

export default function MobileViewPage() {
  const excelData = useAtomValue(excelDataAtom)

  if (!excelData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-gray-500">请先上传表格文件</p>
        <Link href="/" className="mt-4">
          <Button variant="outline">返回上传</Button>
        </Link>
      </div>
    )
  }

  const { headers, rows, sheetName } = excelData
  const mobileRows = transformToMobileView(excelData)

  console.log({headers, rows, sheetName, mobileRows});

  return (
    <div className="container py-4 space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">{sheetName}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="space-y-4 pb-4">
          <TableView />
        </div>
      </ScrollArea>
    </div>
  )
}
