import PageHeader from "@/components/PageHeader";
import { useResourceGroup } from "@/data/resourceGroup/useResourceGroup";
import React from "react";
import AddVmModal from "./modals/AddVmModal";
import { Button } from "@/components/ui/button";
import InterfaceList from "./components/InterfacesList";
import VirtualMachinesList from "./VirtualMachinesList";
import PrivateSegmentDrawer from "./PrivateSegmentDrawer";
import type { Route } from ".react-router/types/src/pages/ResourceGroupEditor/+types/index";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { useDialog } from "@/stores/dialogStore";
import { useTranslation } from "react-i18next";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

export const handle = {
  noScroll: true,
};

const ResourceGroupEditor: React.FC<Route.ComponentProps> = ({
  params: { id },
}) => {
  const { t } = useTranslation();
  const { open } = useDialog();
  const { resourceGroup } = useResourceGroup(id!);
  const [selectedVm, setSelectedVm] = React.useState<string>();
  const { setId } = useResourceGroupEditorStore();

  React.useEffect(() => {
    setId(id!);
  }, [id, setId]);

  return (
    <>
      <AddVmModal id={id!} />
      <PageHeader
        title={resourceGroup?.name ?? ""}
        type={t("resourceGroupEditor.type")}
      />
      <div className="flex flex-row justify-end gap-2 pb-5">
        <Button
          onClick={() => {
            open("addVmToResourceGroup");
          }}
        >
          <PlusIcon />
          {t("resourceGroupEditor.addVirtualMachine")}
        </Button>
        <PrivateSegmentDrawer id={id!} />
        <Button variant={"secondary"}>
          <PencilIcon />
          {t("resourceGroupEditor.edit")}
        </Button>
        <Button variant="destructive">
          <Trash2Icon />
          {t("resourceGroupEditor.delete")}
        </Button>
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
