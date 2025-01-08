import {useTranslation} from "react-i18next";
import {useResourceGroupVms} from "@/data/resourceGroup/useResourceGroupVms";
import VmEventList from "@/pages/Reservation/VmEventList";
import React, {useState} from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";

type VmListProps = {
  id: string
}

const VmList: React.FC<VmListProps> = ({
  id
}) => {
  const { t } = useTranslation();

  const [ vmId, setVmId ] = useState<string | null>(null);
  const { vms, isLoading } = useResourceGroupVms(id);

  if (isLoading) {
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
            onValueChange={setVmId}
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

      {vmId && <VmEventList id={vmId} />}
    </>
  );
};

export default VmList;