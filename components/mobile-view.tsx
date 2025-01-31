"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { excelDataAtom } from "@/lib/store";
import { useAtomValue } from "jotai";
import { transformToMobileView } from "@/lib/excel";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

export function MobileView() {
  const excelData = useAtomValue(excelDataAtom);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!excelData) return null;

  const mobileTables = transformToMobileView(excelData);

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          setCurrentPage((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowRight":
        case "PageDown":
        case " ":
          setCurrentPage((prev) => Math.min(mobileTables.length - 1, prev + 1));
          break;
        case "Home":
          setCurrentPage(0);
          break;
        case "End":
          setCurrentPage(mobileTables.length - 1);
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
      }
    },
    [mobileTables.length],
  );

  // 监听键盘事件
  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFullscreen, handleKeyDown]);

  // 切换全屏状态
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // 页面导航
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(mobileTables.length - 1, page)));
  };

  const currentTable = mobileTables[currentPage];

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "w-full",
      )}
    >
      {/* 内容区域 */}
      <div
        className={cn(
          "w-full flex flex-col transition-all duration-300",
          isFullscreen ? "h-screen" : "h-[500px]",
        )}
      >
        {/* 控制栏 */}
        <div
          className={cn(
            "flex items-center gap-2 p-4",
            isFullscreen ? "justify-between" : "justify-end",
          )}
        >
          {isFullscreen && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} / {mobileTables.length}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= mobileTables.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* 表格内容 */}
        <div className="flex-1 p-4">
          <Card className="w-full h-full">
            <div className="w-full h-full overflow-auto p-4">
              <table className="w-full border-collapse bg-background table-fixed">
                <tbody>
                  {currentTable.headers.map((headerColumn, rowIndex) => (
                    <tr key={rowIndex} className="border-b last:border-b-0">
                      {headerColumn.map((cell, colIndex) => {
                        if (cell.value === null) return null;
                        return (
                          <td
                            key={colIndex}
                            className={cn(
                              "p-2 border-r align-middle break-words",
                              "bg-muted/50 font-medium text-muted-foreground",
                            )}
                            rowSpan={cell.rowSpan}
                            colSpan={cell.colSpan}
                            style={{ width: "40%" }}
                          >
                            {cell.value}
                          </td>
                        );
                      })}
                      <td
                        className="p-2 border-l align-middle break-words"
                        style={{ width: "60%" }}
                      >
                        {currentTable.data[rowIndex]?.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
