import { cn } from "@/lib/utils";
import React from "react";

type ValueDisplayProps = {
  value: string | number | React.ReactNode;
  label: string;
  className?: string;
};

const ValueDisplay: React.FC<ValueDisplayProps> = ({
  value,
  label,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className && className)}>
      <span>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
};

export default ValueDisplay;
