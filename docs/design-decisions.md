# 设计决策文档

## 工作流程设计

我们采用了三步式的工作流程设计，让用户体验更加清晰和直观：

1. **上传表格**：
   - 支持拖拽上传
   - 实时预览文件信息
   - 清晰的错误提示

2. **选择工作表**：
   - 工作表选择
   - 表头行数配置（0-3行）
   - 实时预览数据效果

3. **查看数据**：
   - 支持表格视图和移动视图切换
   - 保持原始格式的表格视图
   - 优化阅读体验的移动视图

## 组件设计

### 通用组件

1. **RowNumber 组件** (`/components/ui/row-number.tsx`)
   - 支持 default/subtle 两种变体
   - 统一的行号显示风格
   - 表头/数据行的视觉区分
   ```tsx
   <RowNumber
     index={rowIndex}
     isHeader={boolean}
     variant="default" | "subtle"
   />
   ```

2. **ViewModeSwitch 组件** (`/components/ui/view-mode-switch.tsx`)
   - 按钮组形式的视图切换
   - 图标 + 文字的直观展示
   - 当前模式的视觉反馈
   ```tsx
   <ViewModeSwitch
     mode="table" | "series"
     onChange={(mode) => void}
   />
   ```

### 状态管理

使用 Jotai 进行状态管理，主要包括：

1. **步骤状态**：
   ```typescript
   export type Step = 'upload' | 'select' | 'view'
   export const stepAtom = atom<Step>('upload')
   ```

2. **工作表选择状态**：
   ```typescript
   export const selectedSheetAtom = atom<string>('')
   export const selectedTableAtom = atom<string>('')
   export const headerRowsAtom = atom<number>(1)
   ```

3. **数据状态**：
   ```typescript
   export const rawExcelAtom = atom<ParsedExcel | null>(null)
   export const excelDataAtom = atom<ExcelData | null>(null)
   ```

### 数据结构设计

1. **Excel 数据结构**：
   ```typescript
   interface CellInfo {
     value: any
     rowSpan?: number
     colSpan?: number
   }

   interface ExcelData {
     sheetName: string
     headers: string[]
     rows: CellInfo[][]
     metadata: {
       headerRows: number
     }
   }
   ```

2. **移动视图数据结构**：
   ```typescript
   interface MobileViewTable {
     headers: CellInfo[][]  // 表头行
     data: CellInfo[]      // 数据行
   }
   ```

## 最佳实践

1. **组件复用**：
   - 将通用的 UI 组件（如 RowNumber、ViewModeSwitch）抽离到 `/components/ui` 目录
   - 支持不同的样式变体以适应不同场景

2. **渐进式增强**：
   - 工作表选择时显示强调的行号
   - 数据预览时使用低调的行号
   - 移动视图优化阅读体验

3. **状态管理**：
   - 使用 Jotai 进行细粒度的状态管理
   - 将相关状态组织在同一文件中
   - 使用原子化的状态便于组件间共享

4. **用户体验**：
   - 清晰的步骤指示
   - 实时的数据预览
   - 直观的视图切换
   - 合理的视觉层次

## 后续优化方向

1. **性能优化**：
   - 考虑大数据量下的分页加载
   - 虚拟滚动优化

2. **功能扩展**：
   - 支持更多的 Excel 特性（公式、样式等）
   - 导出功能
   - 数据筛选和排序

3. **可访问性**：
   - 键盘导航
   - 屏幕阅读器支持
   - 更多的 ARIA 属性
