import { useResourceGroupVms } from "@/data/resourceGroup/useResourceGroupVms";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VmDto } from "@/api";
import VmEventList from "@/pages/Reservation/VmEventList";
import { useUser } from "@/stores/userStore";

type VmListProps = {
  id: string
}

const VmList: React.FC<VmListProps> = ({
  id
}) => {
  const { vms, isLoading } = useResourceGroupVms(id);
  const { activeRole } = useUser();

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center space-x-2">
          <Accordion type="single" collapsible className="w-3/4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((row) => (
              <div key={row} className="w-full p-2">
                <Skeleton className={"h-12 w-full"} />
              </div>
            ))}
          </Accordion>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        <Accordion type="single" collapsible className="w-3/4">
        {vms?.filter((vm: VmDto) => (!vm.hidden || activeRole === "teacher" || activeRole === "administrator"))
            .map((vm: VmDto) => (
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