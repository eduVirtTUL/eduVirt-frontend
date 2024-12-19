import PageHeader from "@/components/PageHeader";
import { useResourceGroup } from "@/data/resourceGroup/useResourceGroup";
import React from "react";
import AddVmModal from "./AddVmModal";
import { Button } from "@/components/ui/button";
import InterfaceList from "./components/InterfacesList";
import VirtualMachinesList from "./VirtualMachinesList";
import PrivateSegmentDrawer from "./PrivateSegmentDrawer";
import type { Route } from ".react-router/types/src/pages/ResourceGroupEditor/+types/index";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";

export const handle = {
  noScroll: true,
};

const ResourceGroupEditor: React.FC<Route.ComponentProps> = ({
  params: { id },
}) => {
  const { resourceGroup } = useResourceGroup(id!);
  const [selectedVm, setSelectedVm] = React.useState<string>();
  const { setId } = useResourceGroupEditorStore();

  React.useEffect(() => {
    setId(id!);
  }, [id, setId]);

  return (
    <>
      <PageHeader title="Create resorce group" />
      <p>{resourceGroup?.name}</p>
      <div className="flex flex-row justify-end gap-2 pb-5">
        <AddVmModal id={id!} />
        <Button variant={"secondary"}>Edit</Button>
        <PrivateSegmentDrawer id={id!} />
      </div>

      <div className="grid grid-cols-2 grid-rows-1 gap-x-5 flex-1 h-full overflow-hidden">
        <VirtualMachinesList
          id={id!}
          selectedVm={selectedVm}
          setSelectedVm={setSelectedVm}
        />
        <InterfaceList id={selectedVm} />
      </div>
    </>
  );
};

export default ResourceGroupEditor;
