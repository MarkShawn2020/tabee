'use client'

import { Button } from "@/components/ui/button"
import { TableIcon, SmartphoneIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewModeSwitchProps {
  mode: 'table' | 'series'
  onChange: (mode: 'table' | 'series') => void
  className?: string
}

export function ViewModeSwitch({ mode, onChange, className }: ViewModeSwitchProps) {
  return (
    <div className={cn("p-1 bg-muted rounded-lg inline-flex gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2",
          mode === 'table' && "bg-background shadow-sm"
        )}
        onClick={() => onChange('table')}
      >
        <TableIcon className="w-4 h-4" />
        <span>表格视图</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2",
          mode === 'series' && "bg-background shadow-sm"
        )}
        onClick={() => onChange('series')}
      >
        <SmartphoneIcon className="w-4 h-4" />
        <span>移动视图</span>
      </Button>
    </div>
  )
}
