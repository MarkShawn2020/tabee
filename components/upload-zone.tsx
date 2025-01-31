import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetAtom } from 'jotai';
import { ExcelError, parseExcelFile } from '@/lib/excel';
import { excelDataAtom, errorAtom, loadingAtom, structureAnalysisAtom } from '@/lib/store';
import { cn } from '@/lib/utils';

export function UploadZone() {
  const setExcelData = useSetAtom(excelDataAtom);
  const setLoading = useSetAtom(loadingAtom);
  const setError = useSetAtom(errorAtom);
  const setStructureAnalysis = useSetAtom(structureAnalysisAtom);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      console.warn('❌ No file provided');
      return;
    }

    console.log('📤 File upload started:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    try {
      setLoading(true);
      setError(null);
      setStructureAnalysis(null);
      
      // 解析 Excel 文件
      const data = await parseExcelFile(file);
      console.log('✅ File processing completed:', {
        sheetName: data.sheetName,
        headers: data.headers.length,
        rows: data.rows.length
      });
      setExcelData(data);

      // 分析表格结构
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/table-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze table structure');
      }

      const analysis = await response.json();
      setStructureAnalysis(analysis);
      
    } catch (err) {
      console.error('❌ Error processing file:', err);
      if (err instanceof ExcelError) {
        setError(err.message);
      } else {
        setError('Failed to parse Excel file');
        console.error('Detailed error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [setExcelData, setError, setLoading, setStructureAnalysis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    onDropRejected: (fileRejections) => {
      console.warn('❌ File rejected:', fileRejections.map(rejection => ({
        file: rejection.file.name,
        errors: rejection.errors.map(err => ({
          code: err.code,
          message: err.message
        }))
      })));
      setError('Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file.');
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="text-4xl">📊</div>
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <>
            <p className="text-lg font-medium">Drop your Excel file here, or click to select</p>
            <p className="text-sm text-gray-500">
              Supports .xlsx, .xls, and .csv files (max 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
