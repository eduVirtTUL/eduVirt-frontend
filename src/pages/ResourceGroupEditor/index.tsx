import PageHeader from "@/components/PageHeader";
import { useResourceGroup } from "@/data/resourceGroup/useResourceGroup";
import React from "react";
import { useParams } from "react-router";
import AddVmModal from "./AddVmModal";
import { Button } from "@/components/ui/button";
import InterfaceList from "./InterfacesList";
import VirtualMachinesList from "./VirtualMachinesList";
import VirtualMachineDetails from "./VirtualMachineDetails";
import PrivateSegmentDrawer from "./PrivateSegmentDrawer";

const ResourceGroupEditor: React.FC = () => {
  const { id } = useParams();
  const { resourceGroup } = useResourceGroup(id!);
  const [selectedVm, setSelectedVm] = React.useState<string>();

  return (
    <>
      <PageHeader title="Create resorce group" />
      <p>{resourceGroup?.name}</p>
      <div className="flex flex-row justify-end gap-2 pb-5">
        <AddVmModal id={id!} />
        <Button variant={"secondary"}>Edit</Button>
        <PrivateSegmentDrawer id={id!} />
      </div>

      <div className="grid grid-cols-4 grid-rows-1 gap-x-5 flex-1 h-full overflow-hidden">
        <VirtualMachinesList
          id={id!}
          selectedVm={selectedVm}
          setSelectedVm={setSelectedVm}
        />
        <VirtualMachineDetails vmId={selectedVm} />
        <InterfaceList id={selectedVm} />
      </div>
    </>
  );
};

export default ResourceGroupEditor;
