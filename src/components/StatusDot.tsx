import { cn } from "@/lib/utils";

export const StatusDot = ({ active }: { active: boolean }) => (
  <div 
    className={cn(
      "h-3 w-3 rounded-full",
      active ? "bg-green-500" : "bg-red-500"
    )} 
  />
);