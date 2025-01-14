import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslation } from "react-i18next";
import { convertMinutesToHoures } from "@/utils/timeUtils";

type RentTimeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  start: number;
  stop: number;
  step: number;
};

const RentTimeSelector: React.FC<RentTimeSelectorProps> = ({
  value,
  onChange,
  start,
  stop,
  step,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const range = Array(Math.ceil((stop - start) / step) + 1)
    .fill(start)
    .map((x, y) => x + y * step);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={t("rentTimeSelector.title")}></SelectValue>
      </SelectTrigger>
      <SelectContent>
        {range.map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {convertMinutesToHoures(value)} {t("houres")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RentTimeSelector;
