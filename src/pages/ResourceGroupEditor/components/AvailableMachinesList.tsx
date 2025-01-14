import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVms } from "@/data/resources/useVms";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import BounceLoader from "react-spinners/BounceLoader";

type AvailableMachinesListProps = {
  id: string;
  onValueChange: (value: string) => void;
};

const AvailableMachinesList: React.FC<AvailableMachinesListProps> = ({
  onValueChange,
}) => {
  const { t } = useTranslation();
  const { vms, isLoading } = useVms();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [text, setText] = React.useState("");
  const [searchText] = useDebounce(text, 500);
  const pageSize = 5;

  const start = currentPage * pageSize;
  const end = start + pageSize;

  const data =
    vms
      ?.filter((vm) =>
        vm.name?.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
      .slice(start, end) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Input
        placeholder={t("addVmModal.searchPlaceholder")}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      {isLoading ? (
        <div className="flex flex-row justify-center">
          <BounceLoader color="#1e1e1e" />
        </div>
      ) : (
        <>
          {data.length === 0 ? (
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">
                {t("addVmModal.noVirtualMachines")}
              </span>
              <span className="text-center">
                {t("addVmModal.noVirtualMachinesDescription")}
              </span>
            </div>
          ) : (
            <>
              <RadioGroup onValueChange={onValueChange}>
                <div className="flex flex-col max-w-full gap-4">
                  {data.map((vm) => (
                    <div
                      className="w-[456px] flex flex-row items-center gap-2"
                      key={vm.id}
                    >
                      <RadioGroupItem value={vm.id ?? ""} />
                      <span className="break-words flex-1 w-full">
                        {vm.name}
                      </span>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex flex-row justify-center">
                <div className="flex flex-row items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <span>
                    {currentPage + 1} /{" "}
                    {Math.ceil((vms?.length ?? 0) / pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={end >= (vms?.length ?? 0)}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AvailableMachinesList;
