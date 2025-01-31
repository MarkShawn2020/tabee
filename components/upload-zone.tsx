'use client'

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAtom, useSetAtom } from 'jotai';
import { ExcelError, parseExcelFile } from '@/lib/excel';
import { errorAtom, loadingAtom, rawExcelAtom } from '@/lib/store';
import { cn } from '@/lib/utils';
import { stepAtom } from '@/lib/steps';

export function UploadZone() {
  const setRawExcel = useSetAtom(rawExcelAtom);
  const setLoading = useSetAtom(loadingAtom);
  const setError = useSetAtom(errorAtom);
  const [step, setStep] = useAtom(stepAtom);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const parsedExcel = await parseExcelFile(file);
      setRawExcel(parsedExcel);
      setStep("select");
    } catch (err) {
      console.error('❌ Error processing file:', err);
      if (err instanceof ExcelError) {
        setError(err.message);
      } else {
        setError('处理文件时出错');
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setRawExcel, setStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full max-w-xl p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center space-y-4">
        <div className="text-4xl">📊</div>
        <div className="text-muted-foreground">
          {isDragActive ? (
            <p>拖放文件到这里 ...</p>
          ) : (
            <p>拖放 Excel 文件到这里，或点击选择文件</p>
          )}
        </div>
      </div>
    </div>
  );
}
