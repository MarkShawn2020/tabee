"use client";

import { DesktopView } from "@/components/desktop-view";
import { MobileView } from "@/components/mobile-view";
import { UploadZone } from "@/components/upload-zone";
import { WorksheetSelector } from "@/components/worksheet-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  excelDataAtom,
  errorAtom,
  loadingAtom,
  viewModeAtom,
} from "@/lib/store";
import { Step as StepType, stepAtom } from "@/lib/steps";
import { useAtom, useAtomValue } from "jotai";
import { Table, Smartphone } from "lucide-react";

export default function Home() {
  const [excelData, setExcelData] = useAtom(excelDataAtom);
  const [step, setStep] = useAtom(stepAtom);
  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  // 判断步骤是否可用
  const canAccessStep = (targetStep: StepType): boolean => {
    if (targetStep === "upload") return true;
    if (targetStep === "select") return !!excelData;
    if (targetStep === "view") return !!excelData;
    return false;
  };

  // 处理步骤点击
  const handleStepClick = (targetStep: StepType) => {
    if (canAccessStep(targetStep)) {
      setStep(targetStep);
    }
  };

  // 渲染当前步骤
  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <UploadZone />
          </div>
        );

      case "select":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <WorksheetSelector />
          </div>
        );

      case "view":
        if (!excelData) return null;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("desktop")}
                  className="gap-2"
                >
                  <Table className="h-4 w-4" />
                  <span>网页视图</span>
                </Button>
                <Button
                  variant={viewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("mobile")}
                  className="gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>移动视图</span>
                </Button>
              </div>
            </div>
            {viewMode === "desktop" ? <DesktopView /> : <MobileView />}
          </div>
        );
    }
  };

  return (
    <main className="w-full container mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          TaBee 智能表格阅读助手
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          让手机端 Excel 表格阅读变得简单高效，支持智能重排和多工作表切换
        </p>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            ⚡️ 10MB 以内文件秒开
          </div>
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            🔒 本地处理，数据安全
          </div>
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            💡 智能重排优化
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
          <Step
            step="upload"
            active={step === "upload"}
            available={canAccessStep("upload")}
            onClick={() => handleStepClick("upload")}
          >
            <span className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                step === "upload"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}>1</span>
              上传表格
            </span>
          </Step>
          <Divider />
          <Step
            step="select"
            active={step === "select"}
            available={canAccessStep("select")}
            onClick={() => handleStepClick("select")}
          >
            <span className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                step === "select"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}>2</span>
              选择工作表
            </span>
          </Step>
          <Divider />
          <Step
            step="view"
            active={step === "view"}
            available={canAccessStep("view")}
            onClick={() => handleStepClick("view")}
          >
            <span className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                step === "view"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}>3</span>
              查看内容
            </span>
          </Step>
        </div>

        {/* Main Content Area */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}
          {renderStep()}
        </div>
      </section>

      {/* Features Section - Only show on upload step */}
      {step === "upload" && (
        <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="text-lg font-semibold mb-2">✨ 智能表格重排</h3>
            <p className="text-sm text-muted-foreground">自动优化表格布局，让手机端阅读更轻松自如</p>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="text-lg font-semibold mb-2">📱 移动优先设计</h3>
            <p className="text-sm text-muted-foreground">完美适配各种移动设备，随时随地轻松查看</p>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="text-lg font-semibold mb-2">🔒 安全可靠</h3>
            <p className="text-sm text-muted-foreground">所有数据本地处理，无需担心隐私泄露</p>
          </div>
        </section>
      )}
    </main>
  );
}

// 步骤指示器组件
interface StepProps {
  children: React.ReactNode;
  active: boolean;
  available: boolean;
  step: StepType;
  onClick: () => void;
}

function Step({ children, active, available, onClick }: StepProps) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`
        px-4 py-2 rounded-lg transition-colors
        ${available ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
        ${active
          ? "bg-primary/5 text-primary"
          : available
            ? "hover:bg-muted"
            : ""}
      `}
    >
      {children}
    </button>
  );
}

// 步骤分隔符
function Divider() {
  return (
    <div className="w-8 h-px bg-border sm:w-px sm:h-8 shrink-0" />
  );
}
