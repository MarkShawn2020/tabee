'use client';

import { useAtomValue } from 'jotai';
import { UploadZone } from '@/components/upload-zone';
import { TableView } from '@/components/table-view';
import { excelDataAtom, errorAtom, loadingAtom } from '@/lib/store';

export default function Home() {
  const excelData = useAtomValue(excelDataAtom);
  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">TaBee</h1>
        <p className="text-gray-500">
          Smart Excel viewer optimized for mobile devices
        </p>
      </div>

      {!excelData && (
        <div className="max-w-xl mx-auto">
          <UploadZone />
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="animate-spin text-2xl">🐝</div>
          <p>Processing your Excel file...</p>
        </div>
      )}

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {excelData && <TableView />}
    </main>
  );
}
