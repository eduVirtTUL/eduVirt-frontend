import {useTranslation} from "react-i18next";
import {useResourceGroupVms} from "@/data/resourceGroup/useResourceGroupVms";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useState} from "react";
import VmInfo from "@/pages/Reservation/VmInfo";
import {Skeleton} from "@/components/ui/skeleton";
import {VmDto} from "@/api";

type ResourceGroupDetails = {
  id: string
}

const ResourceGroupDetails: React.FC<ResourceGroupDetails> = ({
  id
}) => {
  const { t } = useTranslation();

  const [ selectedVm, setSelectedVm ] = useState<VmDto | null>(null);

  const { vms, isLoading: vmsLoading } = useResourceGroupVms(id);

  const handleVmSelection = (vmId: string) => {
    const vm = vms?.find((vm) => vm.id === vmId) || null;
    setSelectedVm(vm);
  };

  if (vmsLoading) {
    return (
      <>
        <div className={"p-4 w-1/2 flex items-center space-x-2"}>
          <Skeleton className={"h-8 w-[100px]"} />
          <Skeleton className={"h-8 w-[200px]"} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={"p-4 w-1/2 flex items-center space-x-2"}>
        <Label className={"w-1/3"}>
          {t("reservations.details.events.chosenVm")}
        </Label>
        <div className={"w-1/3"}>
          <Select
            onValueChange={handleVmSelection}
            defaultValue={''}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("reservations.details.events.chooseVm")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {vms && vms.map((vm) => (
                  <SelectItem key={vm.id!} value={vm.id!}>
                    {vm.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedVm && <VmInfo vm={selectedVm}/>}
    </>
  );
};

export default ResourceGroupDetails;