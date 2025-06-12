import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function getProgressColor(value: number | undefined) {
  if (!value) return "bg-red-600"; // invertido
  if (value > 60) return "bg-green-500"; // invertido
  if (value > 40) return "bg-yellow-500";
  return "bg-red-600"; // invertido
}

const Progress2 = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
    value={value}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full flex-1 transition-all",
        getProgressColor(value)
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));

Progress2.displayName = ProgressPrimitive.Root.displayName;

export { Progress2 };
