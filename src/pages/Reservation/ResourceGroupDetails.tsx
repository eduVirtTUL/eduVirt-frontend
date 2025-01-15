import { useResourceGroupVms } from "@/data/resourceGroup/useResourceGroupVms";
import VmInfo from "@/pages/Reservation/VmInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { VmDto } from "@/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

type ResourceGroupDetails = {
  id: string
}

const ResourceGroupDetails: React.FC<ResourceGroupDetails> = ({id}) => {
  const { vms, isLoading: vmsLoading } = useResourceGroupVms(id);

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
      <div className="flex items-center justify-center space-x-2">
        <Accordion type="single" collapsible className="w-3/4">
          {vms?.filter((vm: VmDto) => !vm.hidden).map((vm: VmDto) => (
            <AccordionItem key={vm.id} value={vm.id!}>
              <AccordionTrigger>{vm.name}</AccordionTrigger>
              <AccordionContent>
                <VmInfo vm={vm} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default ResourceGroupDetails;