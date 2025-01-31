# 组件文档

## 表格相关组件

### WorksheetSelector

工作表选择器组件，用于选择工作表和配置表头。

```tsx
<WorksheetSelector />
```

**功能**：
- 工作表选择
- 表头行数配置（0-3行）
- 实时数据预览
- 行号显示

### TablePreview

表格预览组件，以原始格式显示数据。

```tsx
<TablePreview />
```

**特点**：
- 固定表头
- 合并单元格支持
- 低调的行号显示
- 自适应布局

### TableView

移动视图组件，优化移动端阅读体验。

```tsx
<TableView />
```

**特点**：
- 每行数据独立卡片
- 表头文字作为标签
- 支持合并单元格
- 响应式布局

## UI 组件

### RowNumber

行号显示组件，支持两种显示模式。

```tsx
<RowNumber
  index={number}       // 行号（从0开始）
  isHeader={boolean}   // 是否是表头行
  variant="default" | "subtle"  // 显示风格
/>
```

**变体**：
- default：突出显示，用于工作表选择
- subtle：低调显示，用于数据预览

### ViewModeSwitch

视图切换组件，支持表格视图和移动视图切换。

```tsx
<ViewModeSwitch
  mode="table" | "series"  // 当前视图模式
  onChange={(mode) => void}  // 模式切换回调
  className?: string  // 可选的样式类
/>
```

**特点**：
- 按钮组形式
- 图标 + 文字显示
- 当前模式高亮
- 响应式设计

## 工具函数

### Excel 处理

```typescript
// 解析 Excel 文件
function parseExcelFile(file: File): Promise<ParsedExcel>

// 处理工作表数据
function processSheetData(
  sheetData: CellInfo[][],
  sheetName: string,
  headerRows: number
): ExcelData

// 转换为移动视图格式
function transformToMobileView(data: ExcelData): MobileViewTable[]
```

### 样式工具

```typescript
// 条件类名合并
import { cn } from "@/lib/utils"
cn("base-class", condition && "conditional-class")
```
