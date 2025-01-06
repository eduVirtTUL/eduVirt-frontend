import React from "react";

type ValueDisplayProps = {
  value: string | number;
  label: string;
};

const ValueDisplay: React.FC<ValueDisplayProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col">
      <span>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
};

export default ValueDisplay;
