import { useTranslation } from "react-i18next";
import { useResourceGroupVms } from "@/data/resourceGroup/useResourceGroupVms";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VmDto } from "@/api";
import VmEventList from "@/pages/Reservation/VmEventList";

type VmListProps = {
  id: string
}

const VmList: React.FC<VmListProps> = ({
  id
}) => {
  const { t } = useTranslation();

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
      <div className="flex items-center justify-center space-x-2">
        <Accordion type="single" collapsible className="w-3/4">
        {vms?.filter((vm: VmDto) => !vm.hidden).map((vm: VmDto) => (
          <AccordionItem key={vm.id} value={vm.id!}>
            <AccordionTrigger>{vm.name}</AccordionTrigger>
            <AccordionContent>
              <VmEventList id={vm.id!} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </div>
    </>
  );
};

export default VmList;