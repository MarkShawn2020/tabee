import { cn } from "@/lib/utils"

interface RowNumberProps {
  index: number
  isHeader?: boolean
  variant?: 'default' | 'subtle'
}

export function RowNumber({ index, isHeader, variant = 'default' }: RowNumberProps) {
  return (
    <td className={cn(
      "p-2 border-r text-center select-none sticky left-0",
      variant === 'default' && [
        "w-16",
        isHeader 
          ? "bg-primary text-primary-foreground font-bold" 
          : "bg-muted text-muted-foreground",
        "shadow-[4px_0_4px_-2px_rgba(0,0,0,0.1)]"
      ],
      variant === 'subtle' && [
        "w-12",
        isHeader 
          ? "bg-card text-muted-foreground font-medium" 
          : "bg-card text-muted-foreground/60",
      ]
    )}>
      <div className={cn(
        "rounded",
        variant === 'default' && "px-2 py-0.5",
        variant === 'subtle' && "px-1"
      )}>
        {variant === 'default' ? `#${index + 1}` : index + 1}
      </div>
    </td>
  )
}
