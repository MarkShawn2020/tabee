import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Cloud, File } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Cloud className="h-10 w-10 text-primary animate-bounce" />
        ) : (
          <File className="h-10 w-10 text-gray-400" />
        )}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isDragActive
              ? '松开以上传文件'
              : '拖拽文件到此处，或点击上传'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            支持 .xlsx, .xls, .csv 格式
          </p>
        </div>
        <Button variant="outline" size="sm">
          选择文件
        </Button>
      </div>
    </div>
  )
}
