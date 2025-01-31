# Tabee - 智能表格阅读助手

Tabee 是一款专注于优化手机端 Excel 表格阅读体验的工具。通过智能化的表格重排和导航功能，让用户在手机上轻松阅读和理解表格内容。

## 特性

- 移动优先设计
  - 智能表格重排，优化移动端阅读体验
  - 响应式布局，适配各种屏幕尺寸
- 高效的表格处理
  - 支持 Excel 文件（.xlsx、.xls、.csv）
  - 智能处理合并单元格
  - 支持多工作表切换
  - 支持自定义表头行数（0-3行）
- 现代化界面
  - 基于 Next.js 14 构建
  - 使用 shadcn/ui 组件库
  - 支持深色/浅色主题切换

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件**: shadcn/ui + Tailwind CSS
- **状态管理**: Jotai
- **表格处理**: xlsx
- **类型检查**: TypeScript

## 本地开发

1. 克隆项目并安装依赖

```bash
git clone https://github.com/markshawn2020/Tabee.git
cd Tabee
pnpm install
```

2. 启动开发服务器

```bash
pnpm dev
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 使用限制

- 单个文件大小上限：10MB
- 单个表格最大行数：10,000 行
- 单个表格最大列数：100 列
- 仅支持查看模式，不支持编辑

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
