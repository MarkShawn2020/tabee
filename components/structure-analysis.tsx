import {Card} from "@/components/ui/card";
import {IStructureAnalysis} from "@/lib/store";
import {Check, X, Smartphone} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export function StructureAnalysis(props: { structureAnalysis: IStructureAnalysis }) {
  return (
    <Card className="p-4 w-full">
      <div className="flex items-start gap-3 overflow-x-hidden">
        <div className="w-full overflow-x-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-medium inline-flex items-center gap-2">
              {props.structureAnalysis.isStructured ? (
                <Check className="w-5 h-5 text-green-500 mt-0.5"/>
              ) : (
                <X className="w-5 h-5 text-red-500 mt-0.5"/>
              )}
              
              {props.structureAnalysis.isStructured ? "表格可以结构化展示" : "表格不适合结构化展示"}
            </h3>

            {props.structureAnalysis.isStructured && (
              <Link href="/mobile-view">
                <Button variant="outline" size="sm" className="gap-2">
                  <Smartphone className="w-4 h-4" />
                  移动视图
                </Button>
              </Link>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">{props.structureAnalysis.reason}</p>
          
          {props.structureAnalysis.isStructured && props.structureAnalysis.firstRecord && (
            <div className="mt-2 text-sm w-full">
              <div className="font-medium text-gray-600">数据示例：</div>
              <pre className="mt-1 p-2 rounded-md overflow-x-auto w-full bg-muted">
                {JSON.stringify(props.structureAnalysis.firstRecord, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
