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
import { Step as StepType, stepAtom } from "@/lib/store/steps";
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
                  variant={viewMode === "desktop" ? "default" : "outline"}
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
    <main className="w-full container mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">TaBee</h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Step
            step="upload"
            active={step === "upload"}
            available={canAccessStep("upload")}
            onClick={() => handleStepClick("upload")}
          >
            上传表格
          </Step>
          <Divider />
          <Step
            step="select"
            active={step === "select"}
            available={canAccessStep("select")}
            onClick={() => handleStepClick("select")}
          >
            选择工作表
          </Step>
          <Divider />
          <Step
            step="view"
            active={step === "view"}
            available={canAccessStep("view")}
            onClick={() => handleStepClick("view")}
          >
            查看数据
          </Step>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            <p className="text-sm text-gray-500">处理中...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">{error}</div>
        </div>
      )}

      {!loading && !error && renderStep()}
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
      className={`px-4 py-2 rounded-full text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : available
            ? "bg-muted hover:bg-muted/80 cursor-pointer"
            : "bg-muted/50 cursor-not-allowed"
      }`}
    >
      {children}
    </button>
  );
}

// 步骤分隔符
function Divider() {
  return <div className="h-px w-8 bg-border" />;
}
