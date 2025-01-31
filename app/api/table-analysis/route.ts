import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

// 分析表格结构
async function analyzeTableStructure(workbook: XLSX.WorkBook) {
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][]

  // 移除空行和空列
  const cleanData = rawData.filter((row: unknown) => {
    if (!Array.isArray(row)) return false;
    return row.some(cell => cell !== null && cell !== undefined && cell !== '')
  });

  if (cleanData.length < 2) {
    return {
      isStructured: false,
      reason: 'Not enough data rows'
    }
  }

  // 假设第一行是表头
  const headers = cleanData[0] as string[];
  
  // 检查是否所有行的列数一致
  const isConsistentColumns = cleanData.every((row: unknown[]) => 
    Array.isArray(row) && row.length === headers.length
  );
  
  // 检查是否存在表头
  const hasValidHeaders = headers.every((header: unknown) => 
    typeof header === 'string' && header !== ''
  );

  // 构造第一条记录的JSON示例
  const firstRecord: Record<string, unknown> = {};
  if (cleanData.length > 1) {
    const firstDataRow = cleanData[1] as unknown[];
    headers.forEach((header: string, index: number) => {
      firstRecord[header] = firstDataRow[index];
    });
  }

  return {
    isStructured: isConsistentColumns && hasValidHeaders,
    headers: headers,
    firstRecord: firstRecord,
    reason: isConsistentColumns && hasValidHeaders ? 
      'Table appears to be structured data' : 
      'Inconsistent columns or invalid headers'
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer)
    
    const analysis = await analyzeTableStructure(workbook)
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing table:', error)
    return NextResponse.json(
      { error: 'Failed to analyze table' },
      { status: 500 }
    )
  }
}
